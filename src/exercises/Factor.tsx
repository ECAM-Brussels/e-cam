import { cache } from '@solidjs/router'
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
        oninput={(e: InputEvent) => {
          props.setter?.('attempt', (e.target as MathfieldElement).value)
        }}
      />
    </>
  )
}
