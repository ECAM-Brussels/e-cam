import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

const { Component, schema } = createExerciseType({
  name: 'Differentiate',
  Component: (props) => (
    <>
      <p class="my-4">
        Dérivez l'expression <Math value={props.question.expr} /> par rapport à{' '}
        <Math value={props.question.x} />.
      </p>
      <div class="flex justify-center items-center gap-2">
        <Math
          value={String.raw`\frac{\mathrm{d}}{\mathrm{d} ${props.question.x}} \left( ${props.question.expr} \right) =`}
          displayMode
        />
        <Math name="attempt" editable value={props.attempt} displayMode />
      </div>
    </>
  ),
  question: z.object({
    expr: z.string().min(1),
    x: z.string().default('x'),
  }),
  attempt: z.string().min(1),
  mark: async (question, attempt) => {
    'use server'
    const { expression } = await request(
      graphql(`
        query CheckDerivative($expr: Math!, $attempt: Math!) {
          expression(expr: $expr) {
            diff {
              isEqual(expr: $attempt)
            }
          }
        }
      `),
      { attempt, expr: question.expr },
    )
    return expression.diff.isEqual
  },
  feedback: [
    async (remaining, question, attempt) => {
      const data = await request(
        graphql(`
          query DifferentiationFeedback($expr: Math!, $x: Math!) {
            expression(expr: $expr) {
              diff(x: $x) {
                expr
              }
            }
          }
        `),
        question,
      )
      return { remaining, question, attempt, data }
    },
    (props) => (
      <Show
        when={props.remaining}
        fallback={
          <p>
            La réponse est <Math value={props.data.expression.diff.expr} />
          </p>
        }
      >
        Hello
      </Show>
    ),
  ],
  generator: {
    params: z.object({
      questions: z
        .union([
          z.string().transform((expr) => ({ expr, x: 'x' })),
          z.object({ expr: z.string(), x: z.string() }),
        ])
        .array(),
    }),
    generate: async (params) => {
      'use server'
      return sample(params.questions)!
    },
  },
})

export { Component as default, schema }
