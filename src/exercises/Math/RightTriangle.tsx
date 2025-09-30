import { sample } from 'lodash-es'
import z from 'zod'
import Math from '~/components/Math'
import RightTriangle from '~/components/RightTriangle'
import { createExerciseType } from '~/lib/exercises/base'
import { checkEqual, simplify } from '~/queries/algebra'

const math = z.string().nonempty().or(z.number().transform(String)).optional()

const { Component, schema } = createExerciseType({
  name: 'RightTriangle',
  Component: (props) => (
    <>
      <p>
        Déterminez la valeur de <Math value={props.question[props.question.unknown]} />
      </p>
      <RightTriangle
        a={props.question.angleLocation === 'A' ? props.question.opposite : props.question.adjacent}
        b={props.question.angleLocation === 'A' ? props.question.adjacent : props.question.opposite}
        c={props.question.hypothenuse}
        A={props.question.angleLocation === 'A' ? props.question.angle : undefined}
        B={props.question.angleLocation === 'B' ? props.question.angle : undefined}
        width={props.question.width}
        height={props.question.height}
      />
      <div class="flex justify-center items-center gap-2">
        <Math value={`${props.question[props.question.unknown]} =`} displayMode />
        <Math name="attempt" editable value={props.attempt} />
      </div>
    </>
  ),
  question: z.object({
    opposite: math,
    adjacent: math,
    hypothenuse: math,
    unknown: z.union([
      z.literal('opposite'),
      z.literal('adjacent'),
      z.literal('hypothenuse'),
      z.literal('angle'),
    ]),
    angle: math,
    angleLocation: z.literal('A').or(z.literal('B')).default('B'),
    angleUnit: z.literal('deg').or(z.literal('rad')).default('rad'),
    width: z.number().default(400),
    height: z.number().default(400),
  }),
  attempt: z.string().nonempty(),
  mark: async (question, attempt) => {
    'use server'
    question[question.unknown] = attempt ?? ''
    let formula = ''
    const angle = `(${question.angle}) ${question.angleUnit === 'deg' ? `\\cdot \\frac{\\pi}{360}` : ''}`
    if (question.adjacent === undefined) {
      formula = `\\sin(${angle}) = \\frac{${question.opposite}}{${question.hypothenuse}}`
    } else if (question.opposite === undefined) {
      formula = `\\cos(${angle}) = \\frac{${question.adjacent}}{${question.hypothenuse}}`
    } else {
      formula = `\\tan(${angle}) = \\frac{${question.opposite}}{${question.adjacent}}`
    }
    const [lhs, rhs] = formula.split('=')
    return await checkEqual(lhs, rhs)
  },
  generator: {
    params: z.object({
      Angles: z.string().nonempty().or(z.number().transform(String)).array().nonempty(),
      Hypothenuses: z.string().nonempty().or(z.number().transform(String)).array().nonempty(),
      Unknown: z
        .union([
          z.literal('opposite'),
          z.literal('adjacent'),
          z.literal('hypothenuse'),
          z.literal('angle'),
        ])
        .array()
        .nonempty()
        .default(['opposite', 'adjacent', 'hypothenuse', 'angle']),
      letters: z
        .object({
          angle: z.string().nonempty().array().nonempty().default(['\\alpha', '\\beta', '\\theta']),
          side: z.string().nonempty().array().nonempty().default(['a', 'b', 'c', 'x', 'y']),
        })
        .default({}),
    }),
    generate: async (params) => {
      'use server'
      const hypothenuse = sample(params.Hypothenuses)
      const angle = sample(params.Angles)
      const unknown = sample(params.Unknown)
      const hide = sample(
        (['hypothenuse', 'opposite', 'adjacent'] as const).filter((s) => s !== unknown),
      )!
      const theta = sample(params.letters.angle)
      const x = sample(params.letters.side)
      const getValue = async (side: string, latex: string) => {
        if (side === hide) return undefined
        if (side === unknown) return x
        return await simplify(latex)
      }
      return {
        angle: unknown === 'angle' ? theta : angle,
        adjacent: await getValue('adjacent', `(${hypothenuse}) \\cdot \\cos(${angle})`),
        opposite: await getValue('opposite', `(${hypothenuse}) \\cdot \\sin(${angle})`),
        hypothenuse: await getValue('hypothenuse', hypothenuse),
        unknown,
      }
    },
  },
})

export { Component as default, schema }
