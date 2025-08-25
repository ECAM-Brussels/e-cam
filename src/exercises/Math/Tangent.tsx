import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { narrow } from '~/lib/helpers'

const type = z.union([z.literal('tangent'), z.literal('normal')])

const { Component, schema } = createExerciseType({
  name: 'Tangent',
  Component: (props) => (
    <>
      <p>
        Calculez la {props.question.type === 'tangent' ? 'tangente' : 'normale'} de{' '}
        <Math value={`${props.question.y} = ${props.question.expr}`} /> en{' '}
        <Math value={`${props.question.x} = ${props.question.x0}`} />.
      </p>
      <div class="flex items-center justify-center gap-2">
        <p>Réponse:</p>
        <Math name="attempt" editable value={props.attempt} />
      </div>
    </>
  ),
  question: z.object({
    type: type.default('tangent'),
    expr: z.string().nonempty(),
    x: z.string().default('x'),
    y: z.string().default('y'),
    x0: z.string().nonempty(),
  }),
  attempt: z.string().nonempty(),
  mark: async (question, attempt) => {
    'use server'
    const { expression } = await request(
      graphql(`
        query CheckTangent(
          $expr: Math!
          $attempt: Math!
          $x0: Math!
          $x: Math!
          $y: Math!
          $normal: Boolean
        ) {
          expression(expr: $expr) {
            tangent(x0: $x0, x: $x, y: $y, normal: $normal) {
              isEqual(expr: $attempt)
            }
          }
        }
      `),
      { ...question, attempt, normal: question.type === 'normal' },
    )
    return expression.tangent.isEqual
  },
  feedback: [
    async (remaining, question) => {
      'use server'
      if (!remaining) {
        const { expression } = await request(
          graphql(`
            query CalculateTangent(
              $expr: Math!
              $x0: Math!
              $x: Math!
              $y: Math!
              $normal: Boolean
            ) {
              expression(expr: $expr) {
                tangent(x0: $x0, x: $x, y: $y, normal: $normal) {
                  expr
                }
              }
            }
          `),
          { ...question, normal: question.type === 'normal' },
        )
        return { remaining, ...question, answer: expression.tangent.expr }
      }
      return { remaining, ...question }
    },
    (props) => (
      <Show
        when={narrow(
          () => props,
          (p) => 'answer' in p,
        )}
      >
        {(p) => <Math value={`${p().answer}`} displayMode />}
      </Show>
    ),
  ],
  generator: {
    params: z
      .object({
        Expr: z.string().nonempty().array().nonempty(),
        X0: z.string().nonempty().array().nonempty(),
        types: type.array().nonempty().default(['tangent', 'normal']),
      })
      .array()
      .nonempty(),
    generate: async (params) => {
      'use server'
      const data = sample(params)
      return {
        expr: sample(data.Expr),
        x0: sample(data.X0),
        type: sample(data.types),
      }
    },
  },
})

export { Component as default, schema }
