import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { narrow } from '~/lib/helpers'
import { simplify } from '~/queries/algebra'

async function getRectangularForm(expr: string) {
  const { expression } = await request(
    graphql(`
      query GetComplexRectangularForm($expr: Math!) {
        expression(expr: $expr) {
          expand {
            simplify {
              expr
            }
          }
        }
      }
    `),
    { expr },
  )
  return expression.expand.simplify.expr
}

const { Component, schema } = createExerciseType({
  name: 'Complex',
  Component: (props) => (
    <>
      <p>
        {props.question.text ?? 'Écrivez sous la forme '}
        {
          { rectangular: 'Cartésienne', exponential: 'exponentielle', polar: 'polaire' }[
            props.question.format
          ]
        }
        , c'est-à-dire{' '}
        <Math
          value={
            {
              rectangular: `a + bi`,
              exponential: `r e^{i \\theta}`,
              polar: `r\\left(\\cos \\theta + i \\sin \\theta\\right)`,
            }[props.question.format]
          }
        />
      </p>
      <div class="flex justify-center items-center gap-2">
        <Math value={`${props.question.expr}=`} displayMode />
        <Math name="attempt" editable value={props.attempt} />
      </div>
    </>
  ),
  question: z.object({
    text: z.string().optional(),
    expr: z.string().nonempty(),
    format: z.union([z.literal('rectangular'), z.literal('exponential'), z.literal('polar')]),
  }),
  attempt: z.string().nonempty(),
  feedback: [
    async (remaining, question, _attempt) => {
      'use server'
      const { expression } = await request(
        graphql(`
          query SolveComplex($expr: Math!) {
            expression(expr: $expr) {
              abs {
                expr
              }
              arg {
                expr
              }
              im {
                expr
              }
              real {
                expr
              }
            }
          }
        `),
        question,
      )
      const r = expression.abs.expr
      const theta = expression.arg.expr
      const a = expression.real.expr
      const b = expression.im.expr
      const answers = {
        polar: `${r} \\left(\\cos\\left(${theta}\\right) + i \\sin\\left(${theta}\\right)\\right)`,
        exponential: `${r} e^{i\\left(${theta}\\right)}`,
        rectangular: `\\left(${a}\\right) + \\left(${b}\\right) i`,
      } as const
      if (!remaining) {
        return { remaining, ...question, answer: answers[question.format] }
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
        {(p) => <Math value={`${p().expr} = ${p().answer}`} displayMode />}
      </Show>
    ),
  ],
  mark: async (question, attempt) => {
    'use server'
    const { expression } = await request(
      graphql(`
        query CheckComplex($expr: Math!, $attempt: Math!) {
          expression(expr: $attempt) {
            isEqual(expr: $expr, complex: true)
            isComplexRectangular(strict: false)
            isExponential
            isPolar(strict: true)
            isNumber
          }
        }
      `),
      { ...question, attempt },
    )
    return (
      expression.isEqual &&
      ((question.format === 'rectangular' && expression.isComplexRectangular) ||
        (question.format === 'exponential' && expression.isExponential) ||
        (question.format === 'polar' && expression.isPolar))
    )
  },
  generator: {
    params: z.discriminatedUnion('type', [
      z.object({
        type: z.literal('multiplication'),
        C: z.number().or(z.string().nonempty()).array().nonempty(),
      }),
      z.object({
        type: z.literal('division'),
        C: z.number().or(z.string().nonempty()).array().nonempty(),
      }),
      z.object({
        type: z.literal('powersOfI'),
        N: z.number().array().nonempty(),
      }),
      z.object({
        type: z.literal('powersOfComplexNumber'),
        N: z.number().array().nonempty(),
        R: z.number().transform(String).or(z.string().nonempty()).array().nonempty(),
        Theta: z.number().transform(String).or(z.string().nonempty()).array().nonempty(),
      }),
      z.object({
        type: z.literal('polar'),
        R: z.number().transform(String).or(z.string().nonempty()).array().nonempty(),
        Theta: z.number().transform(String).or(z.string().nonempty()).array().nonempty(),
      }),
      z.object({
        type: z.literal('exponential'),
        R: z.number().transform(String).or(z.string().nonempty()).array().nonempty(),
        Theta: z.number().transform(String).or(z.string().nonempty()).array().nonempty(),
      }),
    ]),
    generate: async (params) => {
      'use server'
      if (params.type === 'polar' || params.type === 'exponential') {
        const [r, theta] = [sample(params.R), sample(params.Theta)]
        return {
          format: params.type,
          expr: await getRectangularForm(`(${r}) (\\cos(${theta}) + i \\sin(${theta}))`),
        }
      } else if (params.type === 'division' || params.type === 'multiplication') {
        const [a, b] = [sample(params.C), sample(params.C)]
        const [c, d] = [sample(params.C), sample(params.C)]
        const [num, den] = await Promise.all([
          simplify(`(${a}) + (${b})i`),
          simplify(`(${c}) + (${d})i`),
        ])
        return {
          format: 'rectangular' as const,
          expr:
            params.type === 'division'
              ? String.raw`\frac{${num}}{${den}}`
              : String.raw`\left(${num}\right)\left(${den}\right)`,
        }
      } else if (params.type === 'powersOfI') {
        const n = sample(params.N)
        return {
          format: 'rectangular' as const,
          expr: `i^{${n}}`,
        }
      } else if (params.type === 'powersOfComplexNumber') {
        const [n, r, theta] = [sample(params.N), sample(params.R), sample(params.Theta)]
        const z = await getRectangularForm(`(${r}) (\\cos(${theta}) + i \\sin(${theta}))`)
        return {
          format: 'exponential' as const,
          expr: String.raw`\left(${z}\right)^{${n}}`,
        }
      } else {
        throw new Error('Type param does not have an acceptable value')
      }
    },
  },
})

export { Component as default, schema }
