import { sample } from 'lodash-es'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

const vector = z.string().nonempty().or(z.number().transform(String)).array().nonempty()

const { Component, schema } = createExerciseType({
  name: 'UnitVector',
  Component: (props) => (
    <>
      <p>
        Calculez le <strong>vecteur unitaire</strong> associé à{' '}
        <Math value={`\\left(${props.question.v.join(';')}\\right)`} />
      </p>
    </>
  ),
  question: z.object({
    v: vector,
  }),
  attempt: z
    .string()
    .nonempty()
    .array()
    .nonempty()
    .or(
      z
        .string()
        .nonempty()
        .transform((s) => [s]),
    ),
  mark: async (question, attempt) => {
    'use server'
    const { vector } = await request(
      graphql(`
        query CheckUnitVector($v: [Math!]!, $attempt: [Math!]!) {
          vector(coordinates: $attempt) {
            angle(coordinates: $v) {
              isEqual(expr: "0")
            }
            norm {
              isEqual(expr: "1")
            }
          }
        }
      `),
      { ...question, attempt },
    )
    return vector.angle.isEqual && vector.norm.isEqual
  },
  generator: {
    params: z.object({
      N: z.number().array().nonempty().default([3]),
      X: vector,
    }),
    generate: async (params) => {
      'use server'
      const n = sample(params.N)
      const v: (string | number)[] = []
      for (let i = 0; i < n; i++) {
        v.push(sample(params.X))
      }
      return { v: vector.parse(v) }
    },
  },
})

export { Component as default, schema }
