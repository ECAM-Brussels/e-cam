import { product } from './Factor'
import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { narrow } from '~/lib/helpers'
import { factor } from '~/queries/algebra'

const possibilities = z.union([
  z.string().or(z.number()).array(),
  z
    .object({
      sum: z.string().or(z.number()).array().array(),
    })
    .transform((obj) => product(...obj.sum).map((t) => t.join('+'))),
])

const { Component, schema } = createExerciseType({
  name: 'Expand',
  Component: (props) => (
    <>
      <p class="my-4">Distribuez au maximum l'expression suivante.</p>
      <div class="flex justify-center items-center gap-2">
        <Math value={`${props.question.expr}=`} />
        <Math name="attempt" editable value={props.attempt} />
      </div>
    </>
  ),
  question: z.object({
    expr: z.string().describe('Expression to expand'),
  }),
  attempt: z.string().min(1),
  mark: async (question, attempt) => {
    'use server'
    const { expression } = await request(
      graphql(`
        query ExpansionCheck($expr: Math!, $attempt: Math!) {
          expression(expr: $attempt) {
            isEqual(expr: $expr)
            isExpanded
          }
        }
      `),
      { expr: question.expr, attempt },
    )
    return expression.isEqual && expression.isExpanded
  },
  feedback: [
    async (remaining, question) => {
      'use server'
      if (!remaining) {
        const { expression } = await request(
          graphql(`
            query Expand($expr: Math!) {
              expression(expr: $expr) {
                expand {
                  expr
                }
              }
            }
          `),
          question,
        )
        return { remaining, ...question, answer: expression.expand.expr }
      }
      return { remaining }
    },
    (props) => (
      <Show
        when={narrow(
          () => props,
          (p) => 'answer' in p,
        )}
      >
        {(p) => <Math value={`${p().expr} = ${p().answer}`} displayMode />}
      </Show>
    ),
  ],
  generator: {
    params: z.object({
      multiply: z
        .union([
          possibilities.transform((term) => ({ term, power: [1] })),
          z.object({
            term: possibilities,
            power: z
              .number()
              .transform((n) => [n])
              .or(z.number().array()),
          }),
        ])
        .array(),
    }),
    generate: async (params) => {
      'use server'
      let expr = ''
      params.multiply.forEach((t) => {
        expr += `(${sample(t.term)})^${sample(t.power)}`
      })
      return { expr: await factor(expr) }
    },
  },
})

export { Component as default, schema }
