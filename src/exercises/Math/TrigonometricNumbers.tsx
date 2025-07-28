import { sample } from 'lodash-es'
import { For, Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

const trigFn = z.union([z.literal('sin'), z.literal('cos'), z.literal('tan'), z.literal('cot')])

const { Component, schema } = createExerciseType({
  name: 'TrigonometricNumbers',
  Component: (props) => (
    <>
      <p>
        Sachant que{' '}
        <Math value={`\\${props.question.fn} ${props.question.theta} = ${props.question.value}`} />{' '}
        et que <Math value={`0 < ${props.question.theta} < \\frac{\\pi}{2}`} />, trouvez les autres
        nombres trigonométriques:
      </p>
      <For each={['sin', 'cos', 'tan', 'cot']}>
        {(fn, index) => (
          <Show
            when={fn != props.question.fn}
            fallback={<input type="hidden" name="attempt" value={props.question.value} />}
          >
            <div class="flex justify-center items-center gap-2">
              <Math value={`\\${fn} ${props.question.theta} =`} displayMode />
              <Math name="attempt" editable value={props.attempt?.[index()] ?? ''} />
            </div>
          </Show>
        )}
      </For>
    </>
  ),
  question: z.object({
    fn: trigFn,
    theta: z.string().nonempty().default('\\theta'),
    value: z.number().transform(String).or(z.string().nonempty()),
  }),
  attempt: z.string().nonempty().array().length(4),
  mark: async (question, [sin, cos, tan, cot]) => {
    'use server'
    const attemptAsObj = { sin, cos, tan, cot }
    const data = await request(
      graphql(`
        query CheckTrigonometricNumbers(
          $sin: Math!
          $cos: Math!
          $tan: Math!
          $cot: Math!
          $pythagoras: Math!
          $tangent: Math!
          $cotangent: Math!
        ) {
          pythagoras: expression(expr: $pythagoras) {
            isEqual(expr: "1")
          }
          tangent: expression(expr: $tangent) {
            isEqual(expr: $tan)
          }
          cotangent: expression(expr: $cotangent) {
            isEqual(expr: $cot)
          }
          signCheck: expression(expr: $sin) {
            isNonnegative
          }
          secondSignCheck: expression(expr: $cos) {
            isNonnegative
          }
        }
      `),
      {
        ...attemptAsObj,
        pythagoras: `(${sin})^2 + (${cos})^2`,
        tangent: `\\frac{${sin}}{${cos}}`,
        cotangent: `\\frac{${cos}}{${sin}}`,
      },
    )
    return (
      question.value === attemptAsObj[question.fn] &&
      data.pythagoras.isEqual &&
      data.tangent.isEqual &&
      data.cotangent.isEqual &&
      data.signCheck.isNonnegative &&
      data.secondSignCheck.isNonnegative
    )
  },
  generator: {
    params: z.object({
      Opposite: z.number().transform(String).or(z.string().nonempty()).array().nonempty(),
      Adjacent: z.number().transform(String).or(z.string().nonempty()).array().nonempty(),
      Fn: trigFn.array().nonempty().default(['sin', 'cos', 'tan', 'cot']),
      Theta: z.string().nonempty().array().default(['\\theta']),
    }),
    generate: async (params) => {
      'use server'
      const [fn, theta] = [sample(params.Fn), sample(params.Theta)]
      const [o, a] = [sample(params.Opposite), sample(params.Adjacent)]
      const h = `\\sqrt{(${o})^2 + (${a})^2}`
      const trigNumbers = {
        sin: `\\frac{${o}}{${h}}`,
        cos: `\\frac{${a}}{${h}}`,
        tan: `\\frac{${o}}{${a}}`,
        cot: `\\frac{${a}}{${o}}`,
      }
      const data = await request(
        graphql(`
          query CalculateTrigNumber($expr: Math!) {
            expression(expr: $expr) {
              simplify {
                expr
              }
            }
          }
        `),
        { expr: trigNumbers[fn] },
      )
      return { fn, value: data.expression.simplify.expr, theta }
    },
  },
})

export { Component as default, schema }
