import { cache } from '@solidjs/router'
import dedent from 'dedent-js'
import { z } from 'zod'
import Code from '~/components/Code'
import ExerciseBase, { ExerciseProps } from '~/components/ExerciseBase'
import Markdown from '~/components/Markdown'
import { decrypt } from '~/lib/cryptography'
import runPython from '~/lib/pyodide/api'

export const schema = z.object({
  question: z.string(),
  code: z.string().optional(),
  answer: z.string(),
  tests: z.string().array(),
})
export type State = z.infer<typeof schema>

async function compareResults(answer: string, results: string[]) {
  'use server'
  const serverResults = JSON.parse(decrypt(answer, import.meta.env.VITE_PASSPHRASE)) as string[]
  return serverResults.filter((v, i) => v === results[i]).length
}

export const mark = cache(async (state: State) => {
  await runPython(state.code || '')
  const results = await Promise.all(state.tests.map(async (test) => (await runPython(test)).output))
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
        run={true}
        onCodeUpdate={(newValue) => props.setter('state', 'code', newValue)}
      />
      <pre>{props.state?.code}</pre>
    </ExerciseBase>
  )
}
