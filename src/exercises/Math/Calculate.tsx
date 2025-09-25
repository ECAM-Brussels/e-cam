import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Markdown from '~/components/Markdown'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { narrow } from '~/lib/helpers'
import { simplify } from '~/queries/algebra'

const trigFunction = z.union([
  z.literal('cos'),
  z.literal('sin'),
  z.literal('tan'),
  z.literal('cot'),
])

const quadrant = z.union([z.literal('I'), z.literal('II'), z.literal('III'), z.literal('IV')])

const question = z.object({
  text: z.string().optional(),
  expr: z.string().nonempty(),
  label: z.string().nonempty().optional(),
  unit: z.string().optional(),
  error: z.number().default(0),
})

const { Component, schema } = createExerciseType({
  name: 'Calculate',
  Component: (props) => (
    <>
      <p class="my-4">
        <Markdown value={props.question.text ?? 'Calculez'} />
      </p>
      <div class="flex justify-center items-center gap-2">
        <Math value={`${props.question.label ?? props.question.expr}=`} displayMode />
        <Math name="attempt" editable value={props.attempt} />
        {props.question.unit}
      </div>
    </>
  ),
  question,
  attempt: z.string().nonempty(),
  mark: async (question, attempt) => {
    'use server'
    const { expression } = await request(
      graphql(`
        query CheckCalculation($expr: Math!, $attempt: Math!, $approx: Boolean!, $error: Float!) {
          expression(expr: $attempt) {
            simplify {
              isEqual(expr: $expr) @skip(if: $approx)
              isApproximatelyEqual(expr: $expr, error: $error) @include(if: $approx)
            }
            isNumber
          }
        }
      `),
      { ...question, approx: question.error > 0, attempt },
    )
    return (
      ((expression.simplify.isEqual || expression.simplify.isApproximatelyEqual) &&
        expression.isNumber) === true
    )
  },
  feedback: [
    async (remaining, question, _attempt) => {
      'use server'
      if (!remaining) {
        return {
          remaining,
          ...question,
          answer: await simplify(question.expr),
        }
      } else {
        return { remaining }
      }
    },
    (props) => (
      <Show
        when={narrow(
          () => props,
          (p) => 'answer' in p,
        )}
      >
        {(p) => (
          <div class="flex items-center justify-center">
            <Math
              value={`${p().label ? `${p().label} =` : ''} ${p().expr} = ${p().answer}`}
              displayMode
            />
            {p().unit}
          </div>
        )}
      </Show>
    ),
  ],
  generator: {
    params: z.discriminatedUnion('type', [
      z.object({
        type: z.literal('trigonometricValues'),
        text: z.string().optional(),
        exercises: z
          .object({
            F: trigFunction.array().nonempty().default(['cos', 'sin', 'tan', 'cot']),
            Alpha: z.string().nonempty().array().nonempty(),
            Q: quadrant.array().nonempty().default(['I', 'II', 'III', 'IV']),
            K: z.number().array().nonempty().default([0]),
          })
          .array()
          .nonempty(),
      }),
      z.object({
        type: z.literal('withParams'),
        questions: z
          .union([z.string().transform((expr) => question.parse({ expr })), question])
          .array()
          .nonempty(),
        subs: z.record(
          z.string().nonempty(),
          z.string().nonempty().or(z.number().transform(String)).array().nonempty(),
        ),
      }),
    ]),
    generate: async (params) => {
      'use server'
      if (params.type === 'trigonometricValues') {
        const ex = sample(params.exercises)
        const [f, q, k] = [sample(ex.F), sample(ex.Q), sample(ex.K)]
        let alpha = sample(ex.Alpha)
        alpha = { I: alpha, II: `\\pi - ${alpha}`, III: `\\pi + ${alpha}`, IV: `-${alpha}` }[q]
        alpha = await simplify(`${alpha} + 2 \\times ${k} \\pi`)
        return { expr: `\\${f}\\left(${alpha}\\right)`, text: params.text }
      } else if (params.type === 'withParams') {
        const question = sample(params.questions)
        Object.entries(params.subs).forEach(([symbol, choices]) => {
          const choice = sample(choices)
          question.expr = question.expr.replaceAll(`{${symbol}}`, `{${choice}}`)
          question.text = question.text?.replaceAll(`{${symbol}}`, `{${choice}}`)
        })
        return question
      } else {
        throw new Error('params.type has incorrect value')
      }
    },
  },
})

export { Component as default, schema }
