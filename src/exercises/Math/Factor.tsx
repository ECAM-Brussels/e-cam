import { sample } from 'lodash-es'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

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

const { Component, schema } = createExerciseType({
  name: 'Factor',
  schema: z
    .object({
      expr: z.string(),
      expand: z
        .boolean()
        .describe('Whether to expand expr before it is seen by the user')
        .default(false),
      attempt: z.string().default(''),
    })
    .transform(async (state) => {
      if (state.expand) {
        const { expression } = await request(
          graphql(`
            query ExpandExpr($expr: Math!) {
              expression(expr: $expr) {
                expand {
                  expr
                }
              }
            }
          `),
          state,
        )
        state.expr = expression.expand.expr
        state.expand = false
      }
      return state as typeof state & { expand: false }
    }),
  mark: async (state) => {
    const { attempt } = await request(
      graphql(`
        query CheckFactorisation($expr: Math!, $attempt: Math!) {
          attempt: expression(expr: $attempt) {
            isEqual(expr: $expr)
            isFactored
          }
        }
      `),
      state,
    )
    return attempt.isEqual && attempt.isFactored
  },
  Component: (props) => (
    <>
      <p>Factorisez l'expression.</p>
      <div class="flex items-center gap-2">
        <Math value={`${props.expr}=`} />
        <Math name="attempt" class="border w-64" editable value={props.attempt} />
      </div>
    </>
  ),
  feedback: [
    async (state) => {
      const { expression } = await request(
        graphql(`
          query SolveFactorisation($expr: Math!) {
            expression(expr: $expr) {
              factor {
                expr
              }
            }
          }
        `),
        { expr: state.expr },
      )
      return { answer: expression.factor.expr }
    },
    (props) => (
      <p>
        La réponse est <Math value={props.answer} />
      </p>
    ),
  ],
  generator: {
    params: z.object({
      A: z.number().array().default([1]),
      roots: z.union([
        math.array().array(),
        z.object({ product: math.array().array() }).transform((set) => product(...set.product)),
      ]),
    }),
    async generate(params) {
      let expr: string = `(${sample(params.A)})`
      sample(params.roots)?.forEach((root) => {
        expr += `(x - (${root}))`
      })
      const { expression } = await request(
        graphql(`
          query GenerateFactoring($expr: Math!) {
            expression(expr: $expr) {
              normalizeRoots {
                expr
              }
            }
          }
        `),
        { expr },
      )
      return { expr: expression.normalizeRoots.expr }
    },
  },
})

export { Component as default, schema }
