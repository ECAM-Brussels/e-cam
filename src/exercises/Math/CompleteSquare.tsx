import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { narrow } from '~/lib/helpers'

const { Component, schema } = createExerciseType({
  name: 'CompleteSquare',
  Component: (props) => (
    <>
      <p class="my-4">Complétez le carré dans l'expression suivante.</p>
      <div class="flex justify-center items-center gap-2">
        <Math value={`${props.question.expr}=`} displayMode />
        <Math name="attempt" editable value={props.attempt} />
      </div>
    </>
  ),
  question: z.object({ expr: z.string() }),
  attempt: z.string().nonempty(),
  mark: async (question, attempt) => {
    'use server'
    const data = await request(
      graphql(`
        query CheckSquare($expr: Math!, $attempt: Math!) {
          attempt: expression(expr: $attempt) {
            isEqual(expr: $expr)
            count(expr: "x")
          }
        }
      `),
      { ...question, attempt },
    )
    return data.attempt.isEqual && data.attempt.count === 1
  },
  feedback: [
    async (remaining, question, _attempt) => {
      'use server'
      const { expression } = await request(
        graphql(`
          query CompleteSquare($expr: Math!) {
            expression(expr: $expr) {
              completeSquare {
                expr
              }
            }
          }
        `),
        question,
      )
      if (!remaining) {
        return {
          remaining,
          ...question,
          answer: expression.completeSquare.expr,
        }
      }
      return { remaining }
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
      A: z.number().or(z.string()).array().nonempty().default([1]),
      Alpha: z.number().or(z.string()).array().nonempty(),
      Beta: z.number().or(z.string()).array().nonempty(),
    }),
    generate: async (params) => {
      'use server'
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
