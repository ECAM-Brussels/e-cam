import { sample } from 'lodash-es'
import { Match, Show, Switch } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { narrow } from '~/lib/helpers'
import { checkFactorisation, expand, normalizePolynomial } from '~/queries/algebra'

export function product<T>(...allEntries: T[][]): T[][] {
  return allEntries.reduce<T[][]>(
    (results, entries) =>
      results
        .map((result) => entries.map((entry) => result.concat([entry])))
        .reduce((subResults, result) => subResults.concat(result), []),
    [[]],
  )
}

const math = z.number().or(z.string())

const { Component, schema, mark, getFeedback } = createExerciseType({
  name: 'Factor',
  Component: (props) => (
    <>
      <p class="my-4">Factorisez au maximum l'expression suivante:</p>
      <div class="flex justify-center items-center gap-2">
        <Math value={`${props.question.expr}=`} displayMode />
        <Math name="attempt" editable value={props.attempt} />
      </div>
    </>
  ),
  question: z
    .object({
      expr: z.string().describe('Expression to factorise'),
      x: z.string().default('x'),
      expand: z
        .boolean()
        .describe('Whether to expand expr before it is seen by the user')
        .default(false),
    })
    .transform(async (state) => {
      if (state.expand) {
        state = { ...state, expr: await expand(state.expr), expand: false }
      }
      return state as typeof state & { expand: false }
    }),
  attempt: z.string().min(1),
  mark: (question, attempt) => checkFactorisation(attempt, question.expr),
  feedback: [
    async (remaining, question) => {
      'use server'
      if (remaining) return question
      const { expression } = await request(
        graphql(`
          query FactorisationFeedback($expr: Math!, $x: Math!) {
            expression(expr: $expr) {
              factor {
                expr
              }
            }
          }
        `),
        question,
      )
      return { ...question, answer: expression.factor.expr }
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
      A: z
        .number()
        .array()
        .default([1])
        .describe('Possibilities for the constant factor in the factorisation'),
      X: z.string().array().default(['x']),
      roots: z
        .union([
          math.array().array(),
          z
            .object({
              product: math
                .array()
                .array()
                .describe(
                  'Generate a list of tuples by taking the cartesian products of the supplied lists',
                ),
            })
            .transform((set) => product(...set.product)),
        ])
        .describe(
          'Possibilities for the roots, either entered as tuples, or a Cartesian product with `product`',
        ),
    }),
    generate: async (params) => {
      'use server'
      let expr = `(${sample(params.A)})`
      sample(params.roots)?.forEach((root) => {
        expr += `(x - (${root}))`
      })
      return { expr: await normalizePolynomial(expr) }
    },
  },
})

export { Component as default, schema, mark, getFeedback }
