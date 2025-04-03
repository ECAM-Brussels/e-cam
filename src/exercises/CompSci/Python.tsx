import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { hash, compare } from 'bcryptjs'
import { For, isServer } from 'solid-js/web'
import { z } from 'zod'
import Code from '~/components/Code'
import Fa from '~/components/Fa'
import Markdown from '~/components/Markdown'
import { encrypt } from '~/lib/cryptography'
import { createExerciseType } from '~/lib/exercises/base'

let execPython: (code: string, test: string) => Promise<string>
if (isServer) {
  const { spawn } = await import('child_process')
  execPython = (code: string, test: string) => {
    return new Promise(async (resolve, reject) => {
      const process = spawn('python', ['-c', `${code}\nprint(${test})`])
      let out = { stdout: '', stderr: '' }
      for (const key of ['stdout', 'stderr'] as const) {
        process[key].on('data', (data) => {
          out[key] += data.toString()
        })
      }
      process.on('close', (exitCode) => {
        if (exitCode !== 0) {
          reject(new Error(`Process exited with code ${exitCode}: ${out.stderr}`))
        }
        resolve(out.stdout.trim())
      })
    }) as Promise<string>
  }
} else {
  const { default: runPython } = await import('~/lib/pyodide/api')
  execPython = async (code: string, test: string) => {
    return (await runPython(`${code}\n${test}`, true)).output
  }
}

function runTests(code: string, tests: string[]): Promise<string>[]
function runTests(code: string, tests: string[], hashes: string[]): Promise<boolean>[]
function runTests(code: string, tests: string[], hashes?: string[]) {
  return tests.map(async (test, index) => {
    const result = await execPython(code, test)
    return hashes?.length ? compare(result, hashes[index]) : hash(result, 10)
  })
}

const { Component, schema } = createExerciseType({
  name: 'Python',
  Component: (props) => (
    <>
      <Markdown value={props.question} />
      <Code lang="python" name="attempt" value={props.attempt} run />
    </>
  ),
  state: z
    .object({
      question: z.string().describe('Question, entered as markdown'),
      attempt: z.string().default('').describe("Student's code"),
      tests: z
        .string()
        .or(z.object({ test: z.string(), desc: z.string() }))
        .array()
        .describe('Tests that will be run'),
      wrap: z.boolean().default(false).describe("Wraps student's code with a `main` function"),
      answer: z.string().describe('Code that passes all the tests'),
      results: z.string().array().default([]),
      constraints: z
        .union([
          z.tuple([
            z.string().describe('Regex'),
            z.boolean().describe("Whether the regex should match when testing the student's code"),
          ]),
          z
            .string()
            .describe("Regex that the student's code must satisfy")
            .transform((val) => [val, true] as const),
        ])
        .array()
        .default([]),
    })
    .transform(async (state) => {
      const tests = state.tests.map((t) => (typeof t === 'string' ? t : t.test))
      const descriptions = state.tests.map((t) =>
        typeof t === 'string' ? `Running ${t} yields the correct output` : t.desc,
      )
      const patch = state.results
        ? {}
        : {
            answer: encrypt(state.answer, import.meta.env.VITE_PASSPHRASE),
            results: await Promise.all(runTests(state.answer, tests)),
          }
      return { ...state, ...patch, tests, descriptions }
    }),
  mark: (state) => {
    if (state.constraints.some(([regex, val]) => new RegExp(regex).test(state.attempt) !== val)) {
      return false
    }
    const tests = runTests(state.attempt, state.tests, state.results)
    return Promise.race([
      Promise.all(tests).then((t) => t.every((v) => v)),
      Promise.race(tests.map(async (t) => ((await t) ? new Promise<never>(() => {}) : false))),
    ])
  },
  feedback: [
    async (state) => {
      const tests = runTests(state.attempt, state.tests, state.results)
      const results = await Promise.all(tests)
      return { results: state.descriptions.map((d, i) => [d, results[i]] as const) }
    },
    (props) => (
      <>
        <h3 class="text-2xl font-semibold my-4">Résultats des tests</h3>
        <ul class="list-disc px-8">
          <For each={props.results}>
            {([desc, result]) => (
              <li classList={{ 'text-green-800': result, 'text-red-800': !result }}>
                {desc} <Fa icon={result ? faCheck : faXmark} />
              </li>
            )}
          </For>
        </ul>
      </>
    ),
  ],
})

export { Component as default, schema }
