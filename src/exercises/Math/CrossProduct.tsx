import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType, useExerciseContext } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { narrow } from '~/lib/helpers'

const vector = (v: [string, string, string]) =>
  String.raw`\begin{pmatrix} ${v[0]} \\ ${v[1]} \\ ${v[2]} \\ \end{pmatrix}`

const { Component, schema } = createExerciseType({
  name: 'CrossProduct',
  Component: (props) => {
    const [c, setC] = createStore<[string, string, string]>(props.attempt ?? ['', '', ''])
    const exercise = useExerciseContext()
    return (
      <>
        <p>Calculez le produit vectoriel suivant</p>
        <div class="flex justify-center items-center gap-2">
          <Math
            value={`${vector(props.question.a)} \\times ${vector(props.question.b)} =`}
            displayMode
          />
          <Math
            value={
              exercise?.readOnly
                ? vector(props.attempt ?? ['', '', ''])
                : vector([
                    String.raw`\placeholder[c1]{${props.attempt?.[0] ?? ''}}`,
                    String.raw`\placeholder[c2]{${props.attempt?.[1] ?? ''}}`,
                    String.raw`\placeholder[c3]{${props.attempt?.[2] ?? ''}}`,
                  ])
            }
            editable
            displayMode
            readOnly
            onBlur={(e) => {
              setC([
                e.target.getPromptValue('c1'),
                e.target.getPromptValue('c2'),
                e.target.getPromptValue('c3'),
              ])
            }}
          />
          <input type="hidden" name="attempt" value={c[0]} />
          <input type="hidden" name="attempt" value={c[1]} />
          <input type="hidden" name="attempt" value={c[2]} />
        </div>
      </>
    )
  },
  question: z.object({
    a: z.tuple([z.string().nonempty(), z.string().nonempty(), z.string().nonempty()]),
    b: z.tuple([z.string().nonempty(), z.string().nonempty(), z.string().nonempty()]),
  }),
  attempt: z.tuple([z.string().nonempty(), z.string().nonempty(), z.string().nonempty()]),
  mark: async (question, attempt) => {
    'use server'
    const { vector } = await request(
      graphql(`
        query CheckCrossProduct($a: [Math!]!, $b: [Math!]!, $attempt: [Math!]!) {
          vector(coordinates: $a) {
            cross(coordinates: $b) {
              isEqual(coordinates: $attempt)
            }
          }
        }
      `),
      { ...question, attempt },
    )
    return vector.cross.isEqual
  },
  feedback: [
    async (remaining, question) => {
      'use server'
      if (!remaining) {
        const { vector } = await request(
          graphql(`
            query CalculateCrossProduct($a: [Math!]!, $b: [Math!]!) {
              vector(coordinates: $a) {
                cross(coordinates: $b) {
                  coordinates
                }
              }
            }
          `),
          question,
        )
        return { remaining, ...question, answer: vector.cross.coordinates }
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
          <Math
            value={`${vector(p().a)} \\times ${vector(p().b)} = ${vector(p().answer as [string, string, string])}`}
            displayMode
          />
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
        string,
        string,
      ],
      b: [sample(params.numbers), sample(params.numbers), sample(params.numbers)] as [
        string,
        string,
        string,
      ],
    }),
  },
})

export { Component as default, schema }
