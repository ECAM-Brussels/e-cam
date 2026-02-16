import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { hash, compare } from 'bcryptjs'
import { createEffect, createSignal } from 'solid-js'
import { For, isServer, Show } from 'solid-js/web'
import { z } from 'zod'
import Button from '~/components/Button'
import Code from '~/components/Code'
import Fa from '~/components/Fa'
import Markdown from '~/components/Markdown'
import { encrypt } from '~/lib/cryptography'
import { createExerciseType } from '~/lib/exercises/base'
import { wrapCode } from '~/lib/helpers'

function filter_error(error_str: string) {
  if (error_str.startsWith("Traceback")) {
    const lines = error_str.trim().split(/\r?\n/);
    return lines[lines.length-1]
  }
  else {
    return error_str
  }
}

export let execPython: (code: string, test: string) => Promise<string>
if (isServer) {
  const { spawn } = await import('child_process')
  execPython = (code: string, test: string) => {
    return new Promise(async (resolve, reject) => {
      const process = spawn('python3', ['-c', `${code}\nprint(${test})`])
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
    const output = await runPython(`${code}\n${test}`, true)
    if (output.format === 'error') {
      throw filter_error(output.output.message)
    }
    return output.output
  }
}


function run_tests(code: string, tests: string[]): Promise<string>[] {
  return tests.map(async (test, index) => {
      return execPython(code, test)
  })
}

function get_hashes(code: string, tests: string[]): Promise<string>[] {
  return run_tests(code, tests).map(async (result) => {
    try {
      return hash(await result, 10)
    }
    catch (error) {
      return String(error)
    }
  })
}

function check_tests(code: string, tests: string[], hashes: string[]): Promise<boolean>[] {
  return run_tests(code, tests).map(async (result, index) => {
    try {
      return compare(await result, hashes[index])
    }
    catch (error) {
      return false
    }
  })
}

type TestFeedback = {
  pass: boolean,
  message: string,
}

function tests_feedback(code: string, tests: string[], hashes: string[]): Promise<TestFeedback>[] {
  return run_tests(code, tests).map(async (result, index) => {
    try {
      const res = await result;
      return {
        pass: await compare(res, hashes[index]),
        message: `Processed result: ${res}`
      }
    }
    catch (error) {
      return {
        pass: false,
        message: String(error)
      }
    }
  })
}

const { Component, schema } = createExerciseType({
  name: 'Python',
  Component: (props) => {
    const [code, setCode] = createSignal('')
    createEffect(() => setCode(props.attempt ?? props.question.initialCode))
    return (
      <>
        <Markdown value={props.question.text} />
        <Code
          class="w-full"
          lang="python"
          name="attempt"
          value={code()}
          run
          onCodeUpdate={setCode}
        />
        <Show when={!props.context.readOnly}>
          <Button type="button" onClick={() => setCode(props.question.initialCode)}>
            Reset
          </Button>
        </Show>
      </>
    )
  },
  question: z
    .object({
      text: z.string().describe('Question, entered as markdown'),
      initialCode: z.string().default(''),
      tests: z
        .string()
        .or(z.object({ test: z.string(), desc: z.string() }))
        .array()
        .describe('Tests that will be run'),
      descriptions: z.string().array().default([]),
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
      const tests = state.tests.map((test, i) => {
        if (typeof test !== 'string') {
          state.descriptions[i] = test.desc
          return test.test
        }
        state.descriptions[i] = state.descriptions[i] ?? `Running ${test} yields correct result`
        return test
      })
      if (state.wrap) state.answer = wrapCode(state.answer)
      const patch = state.results.length
        ? {}
        : {
            answer: await encrypt(state.answer),
            results: await Promise.all(get_hashes(state.answer, tests)),
          }
      return { attempt: '', ...state, ...patch, tests }
    }),
  attempt: z.string().min(1),
  mark: (question, attempt) => {
    if (question.constraints.some(([regex, val]) => new RegExp(regex).test(attempt) !== val)) {
      return false
    }
    if (question.wrap) attempt = wrapCode(attempt)
    const tests = check_tests(attempt, question.tests, question.results)
    return Promise.race([
      Promise.all(tests).then((t) => t.every((v) => v)),
      Promise.race(tests.map(async (t) => ((await t) ? new Promise<never>(() => {}) : false))),
    ])
  },
  feedback: [
    async (_, question, attempt) => {
      if (question.wrap) attempt = wrapCode(attempt)
      const tests = tests_feedback(attempt, question.tests, question.results)
      const results = await Promise.all(tests)
      return {
        results: question.descriptions.map((d, i) => [d, results[i].message, results[i].pass] as const),
      }
    },
    (props) => (
      <>
        <h3 class="text-2xl font-semibold my-4">Résultats des tests</h3>
        <ul class="list-disc px-8">
          <For each={props.results}>
            {([desc, message, result]) => (
              <li classList={{ 'text-green-800': result, 'text-red-800': !result }}>
                {desc} <Fa icon={result ? faCheck : faXmark} /><br />
                <pre>{message}</pre>
              </li>
            )}
          </For>
        </ul>
      </>
    ),
  ],
})

export { Component as default, schema }
