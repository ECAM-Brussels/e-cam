import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

const { Component, schema } = createExerciseType({
  name: 'Calculate',
  Component: (props) => (
    <>
      <p class="my-4">{props.question.text ?? 'Calculez'}</p>
      <div class="flex justify-center items-center gap-2">
        <Math value={`${props.question.expr}=`} displayMode />
        <Math name="attempt" editable value={props.attempt} />
      </div>
    </>
  ),
  question: z.object({
    text: z.string().optional(),
    expr: z.string().nonempty(),
  }),
  attempt: z.string().nonempty(),
  mark: async (question, attempt) => {
    'use server'
    const { expression } = await request(
      graphql(`
        query CheckCalculation($expr: Math!, $attempt: Math!) {
          expression(expr: $attempt) {
            isEqual(expr: $expr)
            isNumber
          }
        }
      `),
      { ...question, attempt },
    )
    return expression.isEqual && expression.isNumber
  },
})

export { Component as default, schema }
