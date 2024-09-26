import { cache } from '@solidjs/router'
import dedent from 'dedent-js'
import { z } from 'zod'
import Code from '~/components/Code'
import ExerciseBase, { ExerciseProps } from '~/components/ExerciseBase'
import Markdown from '~/components/Markdown'
import { decrypt } from '~/lib/cryptography'
import { wrapCode } from '~/lib/helpers'

export const schema = z.object({
  question: z.string(),
  code: z.string().optional(),
  answer: z.string(),
  tests: z.string().array(),
  wrap: z.boolean().optional(),
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
