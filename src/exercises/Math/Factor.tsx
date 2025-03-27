import { sample } from 'lodash-es'
import { Show } from 'solid-js'
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
  Component: (props) => (
    <>
      <p class="my-4">Factorisez au maximum l'expression suivante.</p>
      <div class="flex justify-center items-center gap-2">
        <Math value={`${props.expr}=`} />
        <Math name="attempt" class="border min-w-24 p-2" editable value={props.attempt} />
      </div>
    </>
  ),
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
      <Show when={!props.attempts}>
        <p>
          La réponse est <Math value={props.answer} />
        </p>
      </Show>
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
