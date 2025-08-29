import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { narrow } from '~/lib/helpers'

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
    expr: z.string().nonempty(),
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
    async (remaining, question) => {
      'use server'
      if (!remaining) {
        const data = await request(
          graphql(`
            query DifferentiationFeedback($expr: Math!, $x: Math!) {
              expression(expr: $expr) {
                diff(x: $x) {
                  simplify {
                    expr
                  }
                }
              }
            }
          `),
          question,
        )
        return { remaining, ...question, answer: data.expression.diff.simplify.expr }
      } else {
        return { remaining }
      }
    },
    (props) => (
      <Show
        when={narrow(
          () => props,
          (p) => 'answer' in p,
        )}
      >
        {(props) => (
          <p>
            La réponse est <Math value={props().answer} />
          </p>
        )}
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
        .array()
        .nonempty(),
      subs: z
        .record(
          z.string(),
          z.string().nonempty().or(z.number().transform(String)).array().nonempty(),
        )
        .optional(),
    }),
    generate: async (params) => {
      'use server'
      let question = sample(params.questions)
      if (params.subs) {
        Object.entries(params.subs).forEach(([symbol, choices]) => {
          question.expr = question.expr.replaceAll(`{${symbol}}`, `{${sample(choices)}}`)
        })
      }
      return question
    },
  },
})

export { Component as default, schema }
