import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { sample } from 'lodash-es'
import { onMount, Show } from 'solid-js'
import { For } from 'solid-js'
import { createStore } from 'solid-js/store'
import { z } from 'zod'
import Fa from '~/components/Fa'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

const { Component, schema } = createExerciseType({
  name: 'CompleteSquare',
  Component: (props) => {
    const [lines, setLines] = createStore(props.attempt || [''])
    onMount(() => {})
    return (
      <>
        <p class="my-4">Complétez le carré dans l'expression suivante.</p>
        <For each={lines}>
          {(line, i) => (
            <div class="grid grid-cols-2 justify-center items-center gap-2 my-1">
              <Math class="justify-self-end" value={`${i() == 0 ? props.expr : ''} =`} />
              <div class="flex gap-2">
                <Math class="border min-w-24 p-2" editable name="attempt" value={line} />
                <button type="button" onClick={() => setLines(lines.length, '')}>
                  <Fa icon={faPlus} />
                </button>
                <Show when={i() > 0}>
                  <button
                    type="button"
                    onClick={() => setLines(lines.filter((_, index) => index !== i()))}
                  >
                    <Fa icon={faTrash} />
                  </button>
                </Show>
              </div>
            </div>
          )}
        </For>
      </>
    )
  },
  state: z.object({
    expr: z.string(),
    attempt: z.union([
      z.undefined(),
      z
        .string()
        .min(1)
        .transform((s) => [s]),
      z.string().min(1).array(),
    ]),
  }),
  mark: async (state) => {
    const { attempt } = await request(
      graphql(`
        query CheckSquare($expr: Math!, $attempt: Math!) {
          attempt: expression(expr: $attempt) {
            isEqual(expr: $expr)
            count(expr: "x")
          }
        }
      `),
      { ...state, attempt: state.attempt?.at(-1) ?? '' },
    )
    return attempt.isEqual && attempt.count == 1
  },
  generator: {
    params: z.object({
      A: z.number().or(z.string()).array().default([1]),
      Alpha: z.number().or(z.string()).array(),
      Beta: z.number().or(z.string()).array(),
    }),
    async generate(params) {
      const a = sample(params.A)
      const alpha = sample(params.Alpha)
      const beta = sample(params.Beta)
      const { expression } = await request(
        graphql(`
          query GenerateSquare($expr: Math!) {
            expression(expr: $expr) {
              expand {
                expr
              }
            }
          }
        `),
        { expr: `(${a})(x - ${alpha})^2 + ${beta}` },
      )
      return { expr: expression.expand.expr }
    },
  },
})

export { Component as default, schema }
