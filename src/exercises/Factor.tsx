import { cache } from '@solidjs/router'
import { sample } from 'lodash-es'
import { z } from 'zod'
import Exercise, { type ExerciseProps } from '~/components/Exercise'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  expr: z.string(),
  attempt: z.string(),
})
export type State = z.infer<typeof schema>

export async function generate(params: {
  A: number[]
  X1: number[]
  X2: number[]
}): Promise<State> {
  const a = sample(params.A)
  const x1 = sample(params.X1)
  const x2 = sample(params.X2)
  const { expression } = await request(
    graphql(`
      query GenerateFactorisation($expr: Math!) {
        expression(expr: $expr) {
          expand {
            expr
          }
        }
      }
    `),
    { expr: `${a}(x - ${x1})(x - ${x2})` },
  )
  return { expr: expression.expand.expr, attempt: '' }
}

export const mark = cache(async (state: State) => {
  'use server'

  const { attempt } = await request(
    graphql(`
      query CheckFactorisation($expr: Math!, $attempt: Math!) {
        attempt: expression(expr: $attempt) {
          isEqual(expr: $expr)
          isFactored
        }
      }
    `),
    state,
  )
  return attempt.isEqual && attempt.isFactored
}, 'checkFactorisation')

export default function Factor(props: ExerciseProps<State, Parameters<typeof generate>[0]>) {
  return (
    <Exercise {...props} generate={generate}>
      <p>
        Factor <Math value={props.state?.expr} />
      </p>
      <Math
        editable
        value={props.state?.attempt}
        onInput={(e) => props.setter?.('state', 'attempt', e.target.value)}
      />
    </Exercise>
  )
}
