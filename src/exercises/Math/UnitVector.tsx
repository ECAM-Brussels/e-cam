import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType, useExerciseContext } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { narrow } from '~/lib/helpers'

const vector = z.string().nonempty().or(z.number().transform(String)).array().nonempty()

const vect = (v: string[]) => String.raw`\begin{pmatrix} ${v.join(' \\\\ ')} \\ \end{pmatrix}`

const { Component, schema } = createExerciseType({
  name: 'UnitVector',
  Component: (props) => {
    const [c, setC] = createStore<string[]>(props.attempt ?? ['', '', ''])
    const exercise = useExerciseContext()
    return (
      <>
        <p>
          Calculez le <strong>vecteur unitaire</strong> associé à{' '}
          <Math value={`\\vec v = \\left(${props.question.v.join(';')}\\right)`} />
        </p>
        <p class="flex justify-center items-center gap-2">
          <Math value={`\\hat v =`} displayMode />
          <Math
            value={
              exercise?.readOnly
                ? vect(props.attempt ?? [])
                : vect([
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
        </p>
      </>
    )
  },
  question: z.object({
    v: vector,
  }),
  attempt: z
    .string()
    .nonempty()
    .array()
    .nonempty()
    .or(
      z
        .string()
        .nonempty()
        .transform((s) => [s]),
    ),
  mark: async (question, attempt) => {
    'use server'
    const { vector } = await request(
      graphql(`
        query CheckUnitVector($v: [Math!]!, $attempt: [Math!]!) {
          vector(coordinates: $attempt) {
            angle(coordinates: $v) {
              isEqual(expr: "0")
            }
            norm {
              isEqual(expr: "1")
            }
          }
        }
      `),
      { ...question, attempt },
    )
    return vector.angle.isEqual && vector.norm.isEqual
  },
  feedback: [
    async (remaining, question) => {
      'use server'
      const { vector } = await request(
        graphql(`
          query GetUnitVector($v: [Math!]!) {
            vector(coordinates: $v) {
              unitVector {
                expr {
                  expr
                }
              }
            }
          }
        `),
        question,
      )
      if (!remaining) {
        return { remaining, ...question, answer: vector.unitVector.expr.map((c) => c.expr) }
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
        {(p) => <Math value={`\\hat v = ${vect(p().answer)}`} displayMode />}
      </Show>
    ),
  ],
  generator: {
    params: z.object({
      N: z.number().array().nonempty().default([3]),
      X: vector,
    }),
    generate: async (params) => {
      'use server'
      const n = sample(params.N)
      const v: (string | number)[] = []
      for (let i = 0; i < n; i++) {
        v.push(sample(params.X))
      }
      return { v: vector.parse(v) }
    },
  },
})

export { Component as default, schema }
