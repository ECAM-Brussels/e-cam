import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { narrow } from '~/lib/helpers'
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
  feedback: [
    async (remaining, question) => {
      'use server'
      if (!remaining) {
        const { expression } = await request(
          graphql(`
            query CalculateModulus($expr: Math!) {
              expression(expr: $expr) {
                abs {
                  expr
                }
              }
            }
          `),
          question,
        )
        return { remaining, ...question, answer: expression.abs.expr }
      }
      return { remaining, ...question }
    },
    (props) => (
      <Show
        when={narrow(
          () => props,
          (p) => 'answer' in p,
        )}
      >
        {(props) => <Math value={`\\left|${props().expr}\\right|=${props().answer}`} displayMode />}
      </Show>
    ),
  ],
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
