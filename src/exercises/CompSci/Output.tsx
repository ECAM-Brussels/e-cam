import { execPython } from './Python'
import { hash, compare } from 'bcryptjs'
import z from 'zod'
import Code from '~/components/Code'
import { createExerciseType } from '~/lib/exercises/base'

const { Component, schema } = createExerciseType({
  name: 'Output',
  Component: (props) => (
    <>
      <p>Quel est le résultat du code suivant?</p>
      <Code class="w-full" lang="python" value={props.question.code} />
      <p>
        Réponse:{' '}
        <input
          class="border px-2 py-2 font-mono"
          name="attempt"
          value={props.attempt ?? ''}
          disabled={props.context.readOnly}
        />
      </p>
    </>
  ),
  question: z
    .object({
      code: z.string(),
      answer: z.string().optional(),
    })
    .transform(async (q) => {
      if (q.answer === undefined) {
        const output = await execPython(q.code, '')
        return { ...q, answer: await hash(output, 10) }
      }
      return q as typeof q & { answer: string }
    }),
  attempt: z.string(),
  mark: async (question, attempt) => {
    return compare(attempt, question.answer)
  },
})

export { Component as default, schema }
