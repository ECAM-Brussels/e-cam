import { cache } from '@solidjs/router'
import { sample } from 'lodash-es'
import { z } from 'zod'
import Exercise, { type ExerciseProps } from '~/components/Exercise'
import Math from '~/components/Math'
import Tick from '~/components/Tick'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  expr: z.string().trim().min(1, { message: 'Expression cannot be empty' }),
  attempt: z.string().trim().min(1, { message: 'Expression cannot be empty' }),
})
export type State = z.infer<typeof schema>

export async function generate(params: {
  A: number[]
  Alpha: number[]
  Beta: Number[]
}): Promise<State> {
  const a = sample(params.A)
  const alpha = sample(params.Alpha)
  const beta = sample(params.Beta)
  const { expression } = await request(
    graphql(`
      query GenerateSquare($expr: Math!) {
        expression(expr: $expr) {
          expand {
            expr
          }
        }
      }
    `),
    { expr: `${a}(x - ${alpha})^2 + ${beta}` },
  )
  return { expr: expression.expand.expr, attempt: '' }
}

export const mark = cache(async (state: State) => {
  'use server'

  const { attempt } = await request(
    graphql(`
      query CheckSquare($expr: Math!, $attempt: Math!) {
        attempt: expression(expr: $attempt) {
          isEqual(expr: $expr)
          count(expr: "x")
        }
      }
    `),
    state,
  )
  return attempt.isEqual && attempt.count == 1
}, 'checkSquare')

export default function CompleteSquare(props: ExerciseProps<State, undefined>) {
  return (
    <Exercise {...props} schema={schema} mark={mark} generate={generate}>
      <p>
        Complete the square for <Math value={props.state?.expr} />
      </p>
      <Math
        editable
        value={props.state?.attempt}
        onBlur={(e) => props.setter?.('state', 'attempt', e.target.value)}
      />
      <Tick value={props.feedback?.correct} />
    </Exercise>
  )
}
