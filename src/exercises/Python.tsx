import { cache } from '@solidjs/router'
import dedent from 'dedent-js'
import { z } from 'zod'
import Code from '~/components/Code'
import ExerciseBase, { ExerciseProps } from '~/components/ExerciseBase'
import Markdown from '~/components/Markdown'
import { decrypt } from '~/lib/cryptography'
import { wrapCode } from '~/lib/helpers'

export const schema = z.object({
  /**
   * Question shown to the student, in markdown.
   * This string will be dedented.
   */
  question: z.string(),
  /**
   * (Optional) Will contain the student's attempt.
   * If a value is supplied,
   * this will prefill the text editor for the student with the desired value.
   */
  code: z.string().optional(),
  /**
   * Code that should give the correct solution.
   * It does not need to satisfy the same constraints as the student's code.
   * 
   * As an example, if students need to reimplement the factorial function without importing 'math',
   * this code will still be allowed to import it.
   */
  answer: z.string(),
  /**
   * List of python instructions to run on the student's code (see `code`)
   * and on the model example (see `answer`).
   * An exercise is considered correct if both codes give the same output for every instruction.
   */
  tests: z.string().array(),
  /**
   * Whether to wrap the student's code in a function (called `main`) for testing.
   * The 'main' function takes an array of strings as argument.
   * These strings are used to mock the input() function
   */
  wrap: z.boolean().optional(),
  /**
   * A list of constraints that the student's code must satisfy to be correct.
   * A constraint is a tuple, with a regex given as a string, and a result given as a boolean.
   * 
   * @example
   * ['import\\s+math', false]] // the student's code cannot contain 'import\\s+math'
   * ['import\\s+math', true]] // the student's code must contain 'import\\s+math'
   */
  constraints: z.tuple([z.string(), z.boolean()]).array().optional(),
})
export type State = z.infer<typeof schema>

async function compareResults(answer: string, results: string[]) {
  'use server'
  const serverResults = JSON.parse(decrypt(answer, import.meta.env.VITE_PASSPHRASE)) as string[]
  return serverResults.filter((v, i) => v === results[i]).length
}

export const mark = cache(async (state: State) => {
  let code = state.code || ''
  if (state.constraints) {
    for (const constraint of state.constraints) {
      const [regex, result] = [new RegExp(constraint[0]), constraint[1]]
      if (regex.test(code) !== result) {
        return false
      }
    }
  }
  if (state.wrap) {
    code = wrapCode(code)
  }
  const runPython = (await import('~/lib/pyodide/api')).default
  const results = await Promise.all(
    state.tests.map(async (test) => (await runPython(code + '\n' + test, true)).output),
  )
  const comparison = await compareResults(state.answer, results)
  return comparison === state.tests.length
}, 'checkPython')

export default function PythonExercise(props: ExerciseProps<State, null>) {
  return (
    <ExerciseBase type="Python" {...props} mark={mark} schema={schema}>
      <Markdown value={dedent(props.state?.question || '')} />
      <Code
        value={props.state?.code || ''}
        lang="python"
        readOnly={props.options?.readOnly}
        run={true}
        onCodeUpdate={(newValue) => props.setter('state', 'code', newValue)}
      />
    </ExerciseBase>
  )
}
