import { hash, compare } from 'bcryptjs'
import { isServer } from 'solid-js/web'
import { z } from 'zod'
import Code from '~/components/Code'
import Markdown from '~/components/Markdown'
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
    return hashes ? compare(result, hashes[index]) : hash(result, 10)
  })
}

const { Component, schema } = createExerciseType({
  name: 'Python',
  schema: z
    .object({
      question: z.string().describe('Question, entered as markdown'),
      attempt: z.string().default('').describe("Student's code"),
      tests: z.string().array().describe('Tests that will be run'),
      wrap: z.boolean().default(false).describe("Wraps student's code with a `main` function"),
      answer: z.string().describe('Code that passes all the tests').or(z.string().array()),
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
      if (typeof state.answer === 'string') {
        state = {
          ...state,
          answer: await Promise.all(runTests(state.answer, state.tests)),
        }
      }
      return state as typeof state & { answer: string[] }
    }),
  mark: (state) => {
    if (state.constraints.some(([regex, val]) => new RegExp(regex).test(state.attempt) !== val)) {
      return false
    }
    const promises = runTests(state.attempt, state.tests, state.answer)
    const never: Promise<never> = new Promise(() => {})
    return Promise.race([
      Promise.all(promises).then((results) => results.every((v) => v)),
      Promise.race(promises.map(async (result) => ((await result) ? never : false))),
    ])
  },
  Component: (props) => (
    <>
      <Markdown value={props.question} />
      <Code lang="python" name="attempt" value={props.attempt} run />
    </>
  ),
})

export { Component as default, schema }
