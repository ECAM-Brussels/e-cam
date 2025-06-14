import { random, sample } from 'lodash-es'
import { createEffect, createSignal, For, Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

const { Component, schema } = createExerciseType({
  name: 'System',
  Component: (props) => {
    const [impossible, setImpossible] = createSignal(false)
    createEffect(() => setImpossible(props.attempt === 'impossible'))
    return (
      <>
        <p>Résolvez le système suivant:</p>
        <Math
          value={`
            \\begin{cases}
              ${props.question.equations.join('\\\\')}
            \\end{cases}
          `}
          displayMode
        />
        <label class="my-4">
          <input
            type="checkbox"
            name="attempt"
            value="impossible"
            onChange={(e) => setImpossible(e.target.checked)}
          />{' '}
          Ce système d'équations n'a pas de solution.
        </label>
        <ul class="flex gap-8">
          <Show when={!impossible()}>
            <For each={props.question.variables}>
              {(x, i) => (
                <li class="list-none">
                  <Math value={`${x} =`} />
                  <Math name="attempt" value={props.attempt?.[i()]} editable />
                </li>
              )}
            </For>
          </Show>
        </ul>
      </>
    )
  },
  question: z.object({
    equations: z.string().array().nonempty(),
    variables: z.string().array().nonempty(),
  }),
  attempt: z.union([z.literal('impossible'), z.string().min(1).array().nonempty()]),
  mark: async (question, attempt) => {
    'use server'
    if (attempt === 'impossible') {
      const { system } = await request(
        graphql(`
          query CheckImpossibleSystem($equations: [Math!]!, $variables: [Math!]!) {
            system {
              solve(equations: $equations, variables: $variables) {
                expr
              }
            }
          }
        `),
        question,
      )
      return system.solve.length === 0
    } else {
      const { system } = await request(
        graphql(`
          query CheckSystem($equations: [Math!]!, $variables: [Math!]!, $attempt: [Math!]!) {
            system {
              check(equations: $equations, variables: $variables, x: $attempt)
            }
          }
        `),
        { ...question, attempt },
      )
      return system.check
    }
  },
  generator: {
    params: z.object({
      Variables: z
        .string()
        .min(1)
        .array()
        .nonempty()
        .array()
        .nonempty()
        .default([['x', 'y', 'z']]),
      L: z.number().transform(String).or(z.string().min(1)).array().nonempty(),
      U: z.number().transform(String).or(z.string().min(1)).array().nonempty(),
      X: z.number().transform(String).or(z.string().min(1)).array().nonempty(),
      impossibleProbabiliy: z.number().min(0).max(1).default(0),
      EmptyRows: z.number().array().nonempty().default([0]),
    }),
    generate: async (params) => {
      'use server'
      const variables = sample(params.Variables)
      const impossible = random(0, 1, true) <= params.impossibleProbabiliy
      let emptyRows = sample(params.EmptyRows)
      if (emptyRows === 0 && impossible) {
        emptyRows += 1
      }
      const { system } = await request(
        graphql(`
          query GenerateSystem(
            $variables: [Math!]!
            $L: [Math!]!
            $U: [Math!]!
            $X: [Math!]!
            $zeroRows: Int
            $impossible: Boolean
          ) {
            system {
              generate(
                variables: $variables
                Lentries: $L
                Uentries: $U
                X: $X
                eliminationCount: null
                zeroRows: $zeroRows
                impossible: $impossible
              )
            }
          }
        `),
        { variables, zeroRows: emptyRows, impossible, ...params },
      )
      return { equations: system.generate as [string, ...string[]], variables }
    },
  },
})

export { Component as default, schema }
