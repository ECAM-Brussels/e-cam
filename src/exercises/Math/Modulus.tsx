import { sample } from 'lodash-es'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { simplify } from '~/queries/algebra'

const vector = z.string().nonempty().or(z.number()).array().nonempty()

const { Component, schema } = createExerciseType({
  name: 'Modulus',
  Component: (props) => (
    <>
      <p class="my-4">
        Calculez le module de <Math value={`z = ${props.question.expr}`} />
      </p>
      <div class="flex justify-center items-center gap-2">
        <Math value={`|z| =`} displayMode />
        <Math name="attempt" editable value={props.attempt} />
      </div>
    </>
  ),
  question: z.object({
    expr: z.string().nonempty(),
  }),
  attempt: z.string().nonempty(),
  mark: async (question, attempt) => {
    'use server'
    const { expression } = await request(
      graphql(`
        query CheckModulus($attempt: Math!, $expr: Math!) {
          expression(expr: $expr) {
            abs {
              isEqual(expr: $attempt)
            }
          }
        }
      `),
      { ...question, attempt },
    )
    return expression.abs.isEqual
  },
  generator: {
    params: z.object({
      X: vector,
      Y: vector,
    }),
    generate: async (params) => {
      'use server'
      const [x, y] = [sample(params.X), sample(params.Y)]
      const expr = await simplify(`${x} + i(${y})`)
      return { expr }
    },
  },
})

export { Component as default, schema }
