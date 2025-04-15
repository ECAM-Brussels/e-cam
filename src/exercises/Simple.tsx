import { query } from '@solidjs/router'
import { z } from 'zod'
import ExerciseBase, { type ExerciseProps } from '~/components/ExerciseBase'
import Markdown from '~/components/Markdown'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { decrypt } from '~/lib/cryptography'
import { request } from '~/lib/graphql'

export const schema = z.object({
  question: z.string(),
  answer: z.string().trim().min(1),
  attempt: z.string().trim().min(1).optional(),
  error: z.number().optional(),
})
export type State = z.infer<typeof schema>

export const mark = query(async (state: State) => {
  'use server'

  const { attempt } = await request(
    graphql(`
      query CheckSimple($answer: Math!, $attempt: Math!, $error: Float!) {
        attempt: expression(expr: $attempt) {
          isApproximatelyEqual(expr: $answer, error: $error)
        }
      }
    `),
    {
      error: 0,
      attempt: '',
      ...state,
      answer: decrypt(state.answer, import.meta.env.VITE_PASSPHRASE),
    },
  )
  return attempt.isApproximatelyEqual
}, 'checkSimple')

export const solve = query(async (state: State): Promise<State> => {
  'use server'

  return { ...state, answer: decrypt(state.answer, import.meta.env.VITE_PASSPHRASE) }
}, 'solveSimple')

export default function Simple(props: ExerciseProps<State, null>) {
  return (
    <ExerciseBase
      type="Simple"
      {...props}
      mark={mark}
      schema={schema}
      solve={solve}
      solution={
        <p>
          La réponse est <Math value={props.feedback?.solution?.answer} />
        </p>
      }
    >
      <Markdown value={props.state?.question || ''} />
      <label class="inline-flex items-center gap-2">
        Réponse:
        <Math
          class="border w-64"
          editable={!props.options?.readOnly}
          value={props.state?.attempt}
          onBlur={(e) => props.setter?.('state', 'attempt', e.target.value)}
        />
      </label>
    </ExerciseBase>
  )
}
