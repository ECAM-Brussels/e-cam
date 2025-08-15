import { sample } from 'lodash-es'
import { z } from 'zod'
import Math from '~/components/Math'
import { createExerciseType } from '~/lib/exercises/base'
import { checkEqual } from '~/queries/algebra'

const vector = z.string().nonempty().or(z.number()).array().nonempty()

const { Component, schema } = createExerciseType({
  name: 'Distance',
  Component: (props) => (
    <>
      <p class="my-4">
        Calculez la distance entre <Math value={`\\left(${props.question.A.join(';')}\\right)`} />{' '}
        et <Math value={`\\left(${props.question.B.join(';')}\\right)`} />.
      </p>
      <div class="flex justify-center items-center gap-2">
        <p>Distance</p>
        <Math value={`=`} displayMode />
        <Math name="attempt" editable value={props.attempt} />
      </div>
    </>
  ),
  question: z
    .object({
      A: vector,
      B: vector,
    })
    .refine((data) => data.A.length === data.B.length),
  attempt: z.string().nonempty(),
  mark: async (question, attempt) => {
    'use server'
    let calc = '0'
    for (let i = 0; i < question.A.length; i++) {
      calc += `+ ((${question.B[i]}) - (${question.A[i]}))^2`
    }
    calc = `\\sqrt{${calc}}`
    return await checkEqual(attempt, calc)
  },
  generator: {
    params: z.object({
      N: z.number().array().nonempty().default([3]),
      X: vector,
    }),
    generate: async (params) => {
      'use server'
      const n = sample(params.N)
      const A: (string | number)[] = []
      const B: (string | number)[] = []
      for (let i = 0; i < n; i++) {
        A.push(sample(params.X))
        B.push(sample(params.X))
      }
      return { A: vector.parse(A), B: vector.parse(B) }
    },
  },
})

export { Component as default, schema }
