import { cache } from '@solidjs/router'
import { type SetStoreFunction } from 'solid-js/store'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

type Exercise<S extends object> = S &
  Partial<{
    setter: SetStoreFunction<S>
  }>

type FactorState = {
  expr: string
  attempt: string
}

export const mark = cache(async (state: FactorState) => {
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

export default function Factor(props: Exercise<FactorState>) {
  return (
    <>
      <p>
        Factor <Math value={props.expr} />
      </p>
      <input
        value={props.attempt}
        onInput={(e) => {
          props.setter?.('attempt', e.target.value)
        }}
      />
    </>
  )
}
