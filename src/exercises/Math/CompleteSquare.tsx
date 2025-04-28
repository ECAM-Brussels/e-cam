import { sample } from 'lodash-es'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

const { Component, schema } = createExerciseType({
  name: 'CompleteSquare',
  Component: (props) => (
    <>
      <p class="my-4">Complétez le carré dans l'expression suivante</p>
      <div class="flex justify-center items-center gap-2">
        <Math value={`${props.expr} =`} />
        <Math class="border min-w-24 p-2" editable name="attempt" value={props.attempt} />
      </div>
    </>
  ),
  state: z.object({
    expr: z.string(),
    attempt: z.undefined().or(z.string().min(1)),
  }),
  mark: async (state) => {
    const { attempt } = await request(
      graphql(`
        query CheckSquare($expr: Math!, $attempt: Math!) {
          attempt: expression(expr: $attempt) {
            isEqual(expr: $expr)
            count(expr: "x")
          }
        }
      `),
      { attempt: '', ...state },
    )
    return attempt.isEqual && attempt.count == 1
  },
  generator: {
    params: z.object({
      A: z.number().or(z.string()).array().default([1]),
      Alpha: z.number().or(z.string()).array(),
      Beta: z.number().or(z.string()).array(),
    }),
    async generate(params) {
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
        { expr: `(${a})(x - ${alpha})^2 + ${beta}` },
      )
      return { expr: expression.expand.expr }
    },
  },
})

export { Component as default, schema }
