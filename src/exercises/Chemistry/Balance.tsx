import { sample } from 'lodash-es'
import { For } from 'solid-js'
import z from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

export function chempyToLatex(chempy: string): string {
  return chempy.replace(/([A-Z][a-z]*)(\d*)/g, (_, elem, count) => {
    if (!count || count === '1') return `\\mathrm{${elem}}`
    return `\\mathrm{${elem}}_${count}`
  })
}

const { Component, schema } = createExerciseType({
  name: 'Balance',
  Component: (props) => (
    <>
      <p class="my-4">Pondérez l'équation suivante:</p>
      <div class="flex justify-center items-center gap-2">
        <For each={props.question.reactants}>
          {(reactant, index) => (
            <>
              <input
                class="bg-slate-50 w-8 text-right"
                type="number"
                name={`attempt.${reactant}`}
                value={props.attempt?.[reactant] ?? 1}
              />
              <Math value={chempyToLatex(reactant)} />
              {index() < props.question.reactants.length - 1 && <Math value="+" />}
            </>
          )}
        </For>
        <Math value="\longrightarrow" />
        <For each={props.question.products}>
          {(product, index) => (
            <>
              <input
                class="bg-slate-50 w-8 text-right"
                type="number"
                name={`attempt.${product}`}
                value={props.attempt?.[product] ?? 1}
              />
              <Math value={chempyToLatex(product)} />
              {index() < props.question.reactants.length - 1 && <Math value="+" />}
            </>
          )}
        </For>
      </div>
    </>
  ),
  question: z.object({
    reactants: z.string().nonempty().array().nonempty(),
    products: z.string().nonempty().array().nonempty(),
  }),
  attempt: z.record(z.string().nonempty(), z.coerce.number()),
  mark: async (question, attempt) => {
    'use server'
    const { chemistry } = await request(
      graphql(`
        query BalanceEquation($products: [Formula!]!, $reactants: [Formula!]!) {
          chemistry {
            equation(reactants: $reactants, products: $products) {
              reactants {
                coeff
                formula
              }
              products {
                coeff
                formula
              }
            }
          }
        }
      `),
      question,
    )
    const tests = [...chemistry.equation.reactants, ...chemistry.equation.products]
    for (const substance of tests) {
      if (substance.coeff !== attempt[substance.formula]) {
        return false
      }
    }
    return true
  },
  generator: {
    params: z.object({
      questions: z
        .object({
          reactants: z.string().nonempty().array().nonempty(),
          products: z.string().nonempty().array().nonempty(),
        })
        .array()
        .nonempty(),
    }),
    generate: (params) => {
      return sample(params.questions)
    },
  },
})

export { Component as default, schema }
