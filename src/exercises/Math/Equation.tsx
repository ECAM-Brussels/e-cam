import { createEffect, For, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

const { Component, schema } = createExerciseType({
  name: 'Equation',
  Component: (props) => {
    const [attempt, setAttempt] = createStore<string[]>([])
    createEffect(() => setAttempt(props.attempt ?? []))
    return (
      <>
        <p>Résolvez l'équation</p>
        <Math value={props.question.equation} displayMode />
        <Show when={props.question.interval}>
          {(interval) => (
            <p>
              sur l'intervalle <Math value={`\\left[${interval().join(',')}\\right]`} />.
            </p>
          )}
        </Show>
        <div class="flex gap-8">
          <For each={attempt}>
            {(sol, i) => (
              <label
                class="inline-flex gap-2 items-center"
                onMouseOut={() => {
                  if (!sol) {
                    setAttempt(attempt.filter((_, j) => j !== i()))
                  }
                }}
              >
                <Math value={`${props.question.x} =`} />
                <Math
                  class="border min-w-24 p-2"
                  editable
                  value={sol}
                  name="attempt"
                  onInput={(e) => setAttempt(i(), e.target.value)}
                />
              </label>
            )}
          </For>
          <Show when={attempt.length === 0 || attempt.at(-1) !== ''}>
            <button
              type="button"
              class="inline-flex gap-2 items-center opacity-25 hover:opacity-100"
              onMouseOver={() => setAttempt(attempt.length, '')}
              onFocus={() => setAttempt(attempt.length, '')}
            >
              <Math value={`${props.question.x} =`} />
              <Math class="border min-w-24 p-2" editable />
            </button>
          </Show>
        </div>
      </>
    )
  },
  question: z.object({
    x: z.string().default('x').describe('Unknown value to solve for'),
    equation: z.string().describe('Equation'),
    interval: z.tuple([z.string(), z.string()]).optional(),
    complex: z.boolean().default(false).describe('Solve over C or R'),
  }),
  attempt: z.string().min(1).array(),
  mark: async (question, attempt) => {
    'use server'
    const { interval, ...info } = question
    const { equation } = await request(
      graphql(`
        query CheckEquationSolution(
          $equation: Math!
          $attempt: [Math!]!
          $a: Math
          $b: Math
          $x: Math
          $complex: Boolean
        ) {
          equation: expression(expr: $equation) {
            solveset(a: $a, b: $b, x: $x, complex: $complex) {
              isSetEqual(items: $attempt)
            }
          }
        }
      `),
      { ...info, a: interval?.[0], b: interval?.[1], attempt },
    )
    return equation.solveset.isSetEqual
  },
})

export { Component as default, schema }
