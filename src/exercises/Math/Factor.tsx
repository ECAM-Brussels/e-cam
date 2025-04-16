import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { createExerciseType } from '~/lib/exercises/base'
import {
  checkFactorisation,
  expand,
  factor,
  getFirstRoot,
  normalizePolynomial,
} from '~/queries/algebra'

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
  state: z
    .object({
      expr: z.string().describe('Expression to factorise'),
      expand: z
        .boolean()
        .describe('Whether to expand expr before it is seen by the user')
        .default(false),
      attempt: z.undefined().or(z.string().min(1)).optional().describe("Student's answer"),
    })
    .transform(async (state) => {
      if (state.expand) {
        state = { ...state, expr: await expand(state.expr), expand: false }
      }
      return { attempt: '', ...state } as typeof state & { attempt: string; expand: false }
    }),
  mark: (state) => checkFactorisation(state.attempt, state.expr),
  feedback: [
    async (state, attempts) => {
      if (!attempts) {
        return { answer: await factor(state.expr) }
      } else {
        return { root: await getFirstRoot(state.expr) }
      }
    },
    (props) => (
      <Show when={props.answer} fallback={<p>Une des racines est {props.root}</p>}>
        <p>
          La réponse est <Math value={props.answer} />
        </p>
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
    async generate(params) {
      let expr = `(${sample(params.A)})`
      sample(params.roots)?.forEach((root) => {
        expr += `(x - (${root}))`
      })
      return { expr: await normalizePolynomial(expr) }
    },
  },
})

export { Component as default, schema }
