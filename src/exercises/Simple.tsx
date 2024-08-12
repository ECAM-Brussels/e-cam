import { cache } from '@solidjs/router'
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
  attempt: z.string().trim().min(1),
})
export type State = z.infer<typeof schema>

export const mark = cache(async (state: State) => {
  'use server'

  const { attempt } = await request(
    graphql(`
      query CheckSimple($answer: Math!, $attempt: Math!) {
        attempt: expression(expr: $attempt) {
          isEqual(expr: $answer)
        }
      }
    `),
    { ...state, answer: decrypt(state.answer) },
  )
  return attempt.isEqual
}, 'checkSimple')

export default function Simple(props: ExerciseProps<State, null>) {
  return (
    <ExerciseBase
      type="Simple"
      {...props}
      mark={mark}
      schema={schema}
      solution={
        <p>
          La réponse est <Math value={props.state?.answer} />
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
