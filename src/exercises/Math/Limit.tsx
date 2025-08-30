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
        <Math name="attempt.value" editable value={props.attempt?.value} displayMode />.
      </div>
      <Show when={props.question.differentialQuotient}>
        <p>
          Cette limite est la dérivée de{' '}
          <Math name="attempt.fct" editable value={props.attempt?.fct} />
          en <Math name="attempt.a" editable value={props.attempt?.a} />
        </p>
      </Show>
    </>
  ),
  question: z.object({
    expr: z.string(),
    x: z.string().default('x'),
    x0: z.coerce.string(),
    differentialQuotient: z.boolean().default(false),
  }),
  attempt: z.object({
    value: z.string().nonempty(),
    fct: z.string().default('x'),
    a: z.string().default('x'),
  }),
  mark: async (question, attempt) => {
    'use server'
    const checkLimit = graphql(`
      query CheckLimit(
        $expr: Math!
        $value: Math!
        $fct: Math!
        $x0: Math!
        $a: Math!
        $x: Math!
        $differentialQuotient: Boolean!
      ) {
        expression(expr: $expr) {
          limit(x0: $x0, x: $x) {
            isEqual(expr: $value)
          }
        }
        diffQuotient: expression(expr: $fct) @include(if: $differentialQuotient) {
          differentialQuotient(x: $x, x0: $x0) {
            isEqual(expr: $expr)
          }
        }
        point: expression(expr: $a) @include(if: $differentialQuotient) {
          isEqual(expr: $x0)
        }
      }
    `)
    const data = await request(checkLimit, { ...question, ...attempt })
    return (
      data.expression.limit.isEqual &&
      (data.diffQuotient === undefined ||
        (data.diffQuotient.differentialQuotient.isEqual && data.point?.isEqual === true))
    )
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
      z.object({
        type: z.literal('differentialQuotient'),
        Expr: z.string().nonempty().array().nonempty(),
        X: z.string().array().nonempty().default(['x']),
        X0: z.string().or(z.number().transform(String)).array().nonempty(),
      }),
    ]),
    generate: async (params) => {
      'use server'
      if (params.type === 'finiteRational') {
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
      } else if (params.type === 'differentialQuotient') {
        const [expr, x, x0] = [sample(params.Expr), sample(params.X), sample(params.X0)]
        const data = await request(
          graphql(`
            query CalculateDiffQuotient($expr: Math!, $x: Math!, $x0: Math!) {
              expression(expr: $expr) {
                differentialQuotient(x: $x, x0: $x0) {
                  expr
                }
              }
            }
          `),
          { expr, x, x0 },
        )
        return {
          expr: data.expression.differentialQuotient.expr,
          x,
          x0,
          differentialQuotient: true,
        }
      } else {
        throw new Error('Invalid value for params type')
      }
    },
  },
})

export { Component as default, schema }
