import { random, sample, shuffle } from 'lodash-es'
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
    const hyperplanes = () => {
      if (props.question.variables.length === 2) return 'droites suivantes'
      if (props.question.variables.length === 3) return 'plans suivants'
      return 'hyperplans suivants'
    }
    createEffect(() => setImpossible(props.attempt === 'impossible'))
    return (
      <>
        <p>
          {props.question.geometric
            ? `Trouvez l'intersection entre les ${hyperplanes()}:`
            : 'Résolvez le système suivant:'}
        </p>
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
          {props.question.geometric
            ? `Il n'y a pas d'intensection`
            : `Ce système d'équations n'a pas de solution.`}
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
    geometric: z.boolean().default(false),
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
  feedback: [
    async (remaining, question) => {
      'use server'
      const { system } = await request(
        graphql(`
          query SolveSystem($equations: [Math!]!, $variables: [Math!]!) {
            system {
              solve(equations: $equations, variables: $variables) {
                expr
              }
            }
          }
        `),
        question,
      )
      return {
        remaining,
        ...question,
        answer: system.solve.map((sol) => sol.expr),
      }
    },
    (props) => (
      <Show when={props.answer.length} fallback={<p>Le système n'a pas de solution</p>}>
        <For each={props.answer}>
          {(val, i) => (
            <p>
              <Math value={`${props.variables[i()]} = ${val}`} displayMode />
            </p>
          )}
        </For>
      </Show>
    ),
  ],
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
      geometricProbability: z.number().min(0).max(1).default(0),
      shuffleProbability: z.number().min(0).max(1).default(1),
    }),
    generate: async (params) => {
      'use server'
      const variables = sample(params.Variables)
      const impossible = random(0, 1, true) <= params.impossibleProbabiliy
      const geometric = random(0, 1, true) <= params.geometricProbability
      const shuffleEq = random(0, 1, true) <= params.shuffleProbability
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
      let equations = system.generate as [string, ...string[]]
      if (shuffleEq) equations = shuffle(equations) as [string, ...string[]]
      return { equations, variables, geometric }
    },
  },
})

export { Component as default, schema }
