import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { narrow } from '~/lib/helpers'

const { Component, schema } = createExerciseType({
  name: 'Limit',
  Component: (props) => (
    <>
      <p class="my-4">Calculez la limite suivante</p>
      <div class="flex justify-center items-center gap-2">
        <Math
          value={`\\lim_{${props.question.x} \\to ${props.question.x0}} ${props.question.expr}=`}
          displayMode
        />
        <Math name="attempt" editable value={props.attempt} displayMode />
      </div>
    </>
  ),
  question: z.object({
    expr: z.string(),
    x: z.string().default('x'),
    x0: z.coerce.string(),
  }),
  attempt: z.string().min(1),
  mark: async (question, attempt) => {
    'use server'
    const { expression } = await request(
      graphql(`
        query CheckLimit($expr: Math!, $attempt: Math!, $x0: Math!, $x: Math) {
          expression(expr: $expr) {
            limit(x0: $x0, x: $x) {
              isEqual(expr: $attempt)
            }
          }
        }
      `),
      { ...question, attempt },
    )
    return expression.limit.isEqual
  },
  feedback: [
    async (remaining, question) => {
      'use server'
      if (!remaining) {
        const { expression } = await request(
          graphql(`
            query SolveLimit($expr: Math!, $x0: Math!, $x: Math) {
              expression(expr: $expr) {
                limit(x0: $x0, x: $x) {
                  expr
                }
              }
            }
          `),
          question,
        )
        return { answer: expression.limit.expr, remaining, ...question }
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
        {(props) => (
          <Math
            value={`\\lim_{${props().x} \\to ${props().x0}} ${props().expr} =${props().answer}`}
            displayMode
          />
        )}
      </Show>
    ),
  ],
  generator: {
    params: z.discriminatedUnion('type', [
      z.object({
        type: z.literal('finiteRational'),
        A: z.string().or(z.number()).array().nonempty().default([1]),
        X: z.string().array().nonempty().default(['x']),
        X0: z.string().or(z.number()).array().nonempty(),
        shifts: z.string().or(z.number()).array().nonempty(),
      }),
    ]),
    generate: async (params) => {
      'use server'
      const x = sample(params.X)
      const x0 = String(sample(params.X0))
      const frac = [
        `(${sample(params.A)})(${x} - (${x0}))`,
        `(${sample(params.A)})(${x} - (${x0}))`,
      ].map((term, i) => {
        const deg = sample([2, 3])
        const shifts = params.shifts.filter((val) => i === 0 || (val !== 0 && val !== '0'))
        for (let i = 1; i < deg; i++) {
          term += `((${x}) - (${x0}) - (${sample(shifts)}))`
        }
        return term
      })
      const { num, den } = await request(
        graphql(`
          query CalculateLimitExpression($num: Math!, $den: Math!) {
            num: expression(expr: $num) {
              normalizeRoots {
                expr
              }
            }
            den: expression(expr: $den) {
              normalizeRoots {
                expr
              }
            }
          }
        `),
        { num: frac[0], den: frac[1] },
      )
      const expr = `\\frac{${num.normalizeRoots.expr}}{${den.normalizeRoots.expr}}`
      return { x, x0, expr }
    },
  },
})

export { Component as default, schema }
