import { cache } from '@solidjs/router'
import { sample } from 'lodash-es'
import { type MathfieldElement } from 'mathlive'
import { type SetStoreFunction } from 'solid-js/store'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  expr: z.string(),
  attempt: z.string(),
})
export type State = z.infer<typeof schema>

type Exercise<S extends object> = S &
  Partial<{
    setter: SetStoreFunction<S>
  }>

export async function generate(A: number[], X1: number[], X2: number[]): Promise<State> {
  const a = sample(A)
  const x1 = sample(X1)
  const x2 = sample(X2)
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

export default function Factor(props: Exercise<State>) {
  return (
    <>
      <p>
        Factor <Math value={props.expr} />
      </p>
      <Math
        editable
        value={props.attempt}
        onInput={(e) => {
          props.setter?.('attempt', e.target.value)
        }}
      />
    </>
  )
}
