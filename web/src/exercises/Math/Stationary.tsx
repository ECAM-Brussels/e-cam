import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { MathJSON } from '~/components/MathSet'
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
          <Show when={props.question.S}>
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
    S: MathJSON.optional(),
    x: z.string().nonempty().default('x'),
    type: z
      .union([z.literal('stationary'), z.literal('max'), z.literal('min')])
      .default('stationary'),
  }),
  attempt: z.union([z.string().min(1).array(), z.string().transform((val) => [val])]),
  mark: async (question, attempt) => {
    'use server'
    if (question.type === 'stationary') {
      const { expression } = await request(
        graphql(`
          query CheckStationaryPoint($expr: Math!, $attempt: MathSet!, $S: MathSet, $x: Math) {
            expression(expr: $expr) {
              stationaryPoints(x: $x, S: $S) {
                isSetEqual(S: $attempt)
              }
            }
          }
        `),
        { ...question, attempt: ['FiniteSet', ...attempt] },
      )
      return expression.stationaryPoints.isSetEqual
    } else if (question.type === 'max') {
      const { expression } = await request(
        graphql(`
          query CheckMaximum($expr: Math!, $attempt: Math!, $S: MathSet, $x: Math) {
            expression(expr: $expr) {
              maximum(x: $x, S: $S) {
                isEqual(expr: $attempt)
              }
            }
          }
        `),
        { ...question, attempt: attempt[0] },
      )
      return expression.maximum.isEqual
    } else {
      const { expression } = await request(
        graphql(`
          query CheckMinimum($expr: Math!, $attempt: Math!, $S: MathSet, $x: Math) {
            expression(expr: $expr) {
              minimum(x: $x, S: $S) {
                isEqual(expr: $attempt)
              }
            }
          }
        `),
        { ...question, attempt: attempt[0] },
      )
      return expression.minimum.isEqual
    }
  },
  generator: {
    params: z.object({
      questions: z
        .object({
          expr: z.string().nonempty(),
          x: z.string().default('x'),
          S: MathJSON.optional(),
          types: z
            .union([z.literal('stationary'), z.literal('max'), z.literal('min')])
            .array()
            .nonempty()
            .default(['stationary', 'max', 'min']),
        })
        .array()
        .nonempty(),
    }),
    generate: async (params) => {
      'use server'
      const { types, ...question } = sample(params.questions)
      return { ...question, type: sample(types) }
    },
  },
})

export { Component as default, schema }
