import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { createExerciseType } from '~/lib/exercises/base'
import { narrow } from '~/lib/helpers'
import { checkEqual, simplify } from '~/queries/algebra'

const vector = z.string().nonempty().or(z.number()).array().nonempty()

const { Component, schema } = createExerciseType({
  name: 'Norm',
  Component: (props) => (
    <>
      <p class="my-4">
        Calculez la norme du vecteur <Math value={`\\left(${props.question.A.join(';')}\\right)`} />
      </p>
      <div class="flex justify-center items-center gap-2">
        <p>Norme</p>
        <Math value={`=`} displayMode />
        <Math name="attempt" editable value={props.attempt} />
      </div>
    </>
  ),
  question: z.object({
    A: vector,
  }),
  attempt: z.string().nonempty(),
  mark: async (question, attempt) => {
    'use server'
    let calc = question.A.map((n) => `(${n})^2`)
    return await checkEqual(attempt, `\\sqrt{${calc.join('+')}}`)
  },
  feedback: [
    async (remaining, question) => {
      'use server'
      if (!remaining) {
        let calc = question.A.map((n) => `(${n})^2`)
        return {
          remaining,
          ...question,
          answer: await simplify(`\\sqrt{${calc.join('+')}}`),
        }
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
        {(props) => (
          <Math
            value={`\\left\\|\\begin{pmatrix} ${props().A.join(' \\\\ ')}\\end{pmatrix}\\right\\|=${props().answer}`}
            displayMode
          />
        )}
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
      const A: (string | number)[] = []
      for (let i = 0; i < n; i++) {
        A.push(sample(params.X))
      }
      return { A: vector.parse(A) }
    },
  },
})

export { Component as default, schema }
