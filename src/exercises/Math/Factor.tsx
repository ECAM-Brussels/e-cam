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
const couple = z.tuple([math, math])
const triplet = z.tuple([math, math, math])

const { Component, schema } = createExerciseType({
  name: 'Factor',
  schema: z.object({
    expr: z.string(),
    attempt: z.string().default(''),
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
  solve: async (state) => {
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
    return { ...state, attempt: expression.factor.expr }
  },
  params: z.object({
    A: z.number().array().default([1]),
    roots: z.union([
      couple.array(),
      triplet.array(),
      z.object({
        product: math.array().array(),
      }),
    ]),
  }),
  generator: async (params) => {
    let expr: string = `${sample(params.A)}`
    const roots = 'product' in params.roots ? product(...params.roots.product) : params.roots
    sample(roots)!.forEach((root) => {
      expr += `(x - ${root})`
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
})

export { Component as default, schema }
