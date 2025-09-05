import { random, sample, sampleSize } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import RightTriangle from '~/components/RightTriangle'
import { createExerciseType } from '~/lib/exercises/base'
import { narrow } from '~/lib/helpers'
import { checkEqual, simplify } from '~/queries/algebra'

const math = z.string().nonempty().or(z.number().transform(String))

const { Component, schema } = createExerciseType({
  name: 'Pythagoras',
  Component: (props) => (
    <>
      <p class="my-4">
        Trouvez la valeur de <Math value={props.question[props.question.unknown]} />
      </p>
      <RightTriangle
        a={props.question.a}
        b={props.question.b}
        c={props.question.c}
        width={props.question.width}
        height={props.question.height}
      />
      <div class="flex justify-center items-center gap-2">
        <Math value={`${props.question[props.question.unknown]} =`} />
        <Math name="attempt" editable value={props.attempt} />
      </div>
    </>
  ),
  question: z.object({
    a: math,
    b: math,
    c: math,
    unknown: z.union([z.literal('a'), z.literal('b'), z.literal('c')]),
    width: z.number().default(400),
    height: z.number().default(400),
  }),
  attempt: z.string().nonempty(),
  mark: async (question, attempt) => {
    'use server'
    const { width, height, unknown, ...data } = question
    data[question.unknown] = attempt ?? ''
    return await checkEqual(`(${data.a})^2 + (${data.b})^2 - (${data.c})^2`, '0')
  },
  feedback: [
    async (remaining, question) => {
      'use server'
      if (!remaining) {
        const eqs = {
          a: `\\sqrt{(${question.c})^2 - (${question.b})^2}`,
          b: `\\sqrt{(${question.c})^2 - (${question.a})^2}`,
          c: `\\sqrt{(${question.a})^2 + (${question.b})^2}`,
        } as const
        return { remaining, ...question, answer: await simplify(eqs[question.unknown]) }
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
        {(props) => <Math value={`${props()[props().unknown]} = ${props().answer}`} displayMode />}
      </Show>
    ),
  ],
  generator: {
    params: z.object({
      N: z.number(),
      K: z.number(),
      X: math.array().nonempty(),
    }),
    generate: async (params) => {
      'use server'
      const unknown = sample(['a', 'b', 'c']) as 'a' | 'b' | 'c'
      const x = sample(params.X)
      const [m, n] = sampleSize(
        [...Array(params.N).keys()].map((n) => n + 1),
        2,
      )
      const k = random(1, params.K)
      let a = k * (m ** 2 - n ** 2)
      a = a < 0 ? -a : a
      let b = 2 * k * m * n
      let c = k * (m ** 2 + n ** 2)
      return {
        a: unknown === 'a' ? x : a,
        b: unknown === 'b' ? x : b,
        c: unknown === 'c' ? x : c,
        unknown,
      }
    },
  },
})

export { Component as default, schema }
