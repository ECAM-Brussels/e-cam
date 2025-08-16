import { sample } from 'lodash-es'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { simplify } from '~/queries/algebra'

const vector = z.string().nonempty().or(z.number()).array().nonempty()

const { Component, schema } = createExerciseType({
  name: 'Argument',
  Component: (props) => (
    <>
      <p class="my-4">
        Calculez l'argument de <Math value={`z = ${props.question.expr}`} />
      </p>
      <div class="flex justify-center items-center gap-2">
        <Math value={`\\mathrm{arg} z =`} displayMode />
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
        query CheckArgument($attempt: Math!, $expr: Math!) {
          expression(expr: $expr) {
            arg {
              isEqual(expr: $attempt)
            }
          }
        }
      `),
      { ...question, attempt },
    )
    return expression.arg.isEqual
  },
  generator: {
    params: z.object({
      R: vector,
      Theta: vector,
    }),
    generate: async (params) => {
      'use server'
      const [r, theta] = [sample(params.R), sample(params.Theta)]
      const expr = await simplify(`(${r})(\\cos{${theta}} + i \\sin{${theta}})`)
      return { expr }
    },
  },
})

export { Component as default, schema }
