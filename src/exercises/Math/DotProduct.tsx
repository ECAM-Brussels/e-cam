import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { narrow } from '~/lib/helpers'

const vector = (v: string[]) => `\\begin{pmatrix}${v.join(` \\\\ `)}\\end{pmatrix}`

const { Component, schema } = createExerciseType({
  name: 'DotProduct',
  Component: (props) => (
    <>
      <p>Calculez le produit scalaire suivant</p>
      <div class="flex justify-center items-center gap-2">
        <Math
          value={`${vector(props.question.a)} \\cdot ${vector(props.question.b)} =`}
          displayMode
        />
        <Math name="attempt" value={props.attempt} editable displayMode />
      </div>
    </>
  ),
  question: z.object({
    a: z.string().nonempty().or(z.number().transform(String)).array().nonempty(),
    b: z.string().nonempty().or(z.number().transform(String)).array().nonempty(),
  }),
  attempt: z.string().nonempty(),
  mark: async (question, attempt) => {
    'use server'
    const { vector } = await request(
      graphql(`
        query CheckDotProduct($a: [Math!]!, $b: [Math!]!, $attempt: Math!) {
          vector(coordinates: $a) {
            dot(coordinates: $b) {
              isEqual(expr: $attempt)
            }
          }
        }
      `),
      { ...question, attempt },
    )
    return vector.dot.isEqual
  },
  feedback: [
    async (remaining, question) => {
      'use server'
      if (!remaining) {
        const { vector } = await request(
          graphql(`
            query CalculateDotProduct($a: [Math!]!, $b: [Math!]!) {
              vector(coordinates: $a) {
                dot(coordinates: $b) {
                  expr
                }
              }
            }
          `),
          question,
        )
        return { remaining, ...question, answer: vector.dot.expr }
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
        {(p) => (
          <Math value={`${vector(p().a)} \\cdot ${vector(p().b)} = ${p().answer}`} displayMode />
        )}
      </Show>
    ),
  ],
  generator: {
    params: z.object({
      numbers: z.string().nonempty().or(z.number().transform(String)).array().nonempty(),
    }),
    generate: async (params) => ({
      a: [sample(params.numbers), sample(params.numbers), sample(params.numbers)] as [
        string,
        ...string[],
      ],
      b: [sample(params.numbers), sample(params.numbers), sample(params.numbers)] as [
        string,
        ...string[],
      ],
    }),
  },
})

export { Component as default, schema }
