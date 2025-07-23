import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

const { Component, schema } = createExerciseType({
  name: 'Stationary',
  Component: (props) => {
    const obj = () =>
      ({
        stationary: 'les points critiques',
        max: 'la valeur maximale',
        min: 'la valeur minimale',
      })[props.question.type]
    return (
      <>
        <p>
          Trouvez {obj()} de <Math value={props.question.expr} />{' '}
          <Show when={props.question.interval?.join(',')}>
            {(interval) => (
              <>
                sur l'intervalle <Math value={`\\left[${interval()}\\right]`} />.
              </>
            )}
          </Show>
        </p>
      </>
    )
  },
  question: z.object({
    expr: z.string().nonempty(),
    interval: z.tuple([z.string().nonempty(), z.string().nonempty()]).optional(),
    x: z.string().nonempty().default('x'),
    type: z
      .union([z.literal('stationary'), z.literal('max'), z.literal('min')])
      .default('stationary'),
  }),
  attempt: z.union([z.string().min(1).array(), z.string().transform((val) => [val])]),
  mark: async (question, attempt) => {
    'use server'
    const { interval, ...info } = question
    if (question.type === 'stationary') {
      const { expression } = await request(
        graphql(`
          query CheckStationaryPoint(
            $expr: Math!
            $attempt: [Math!]!
            $a: Math
            $b: Math
            $x: Math
          ) {
            expression(expr: $expr) {
              stationaryPoints(x: $x, a: $a, b: $b) {
                isSetEqual(items: $attempt)
              }
            }
          }
        `),
        { ...info, a: interval?.[0], b: interval?.[1], attempt },
      )
      return expression.stationaryPoints.isSetEqual
    } else if (question.type === 'max') {
      const { expression } = await request(
        graphql(`
          query CheckMaximum($expr: Math!, $attempt: Math!, $a: Math, $b: Math, $x: Math) {
            expression(expr: $expr) {
              maximum(x: $x, a: $a, b: $b) {
                isEqual(expr: $attempt)
              }
            }
          }
        `),
        { ...info, a: interval?.[0], b: interval?.[1], attempt: attempt[0] },
      )
      return expression.maximum.isEqual
    } else {
      const { expression } = await request(
        graphql(`
          query CheckMinimum($expr: Math!, $attempt: Math!, $a: Math, $b: Math, $x: Math) {
            expression(expr: $expr) {
              minimum(x: $x, a: $a, b: $b) {
                isEqual(expr: $attempt)
              }
            }
          }
        `),
        { ...info, a: interval?.[0], b: interval?.[1], attempt: attempt[0] },
      )
      return expression.minimum.isEqual
    }
  },
})

export { Component as default, schema }
