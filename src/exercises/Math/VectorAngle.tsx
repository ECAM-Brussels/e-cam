import { sample } from 'lodash-es'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

function vector(components: (string | number)[]) {
  return `\\begin{pmatrix}${components.join(' \\\\')}\\end{pmatrix}`
}

const { Component, schema } = createExerciseType({
  name: 'VectorAngle',
  Component: (props) => (
    <>
      <div class="flex items-center gap-12">
        <p>
          Trouvez l'angle entre les vecteurs suivants en{' '}
          <strong>{props.question.unit === 'degrees' ? 'degrés' : 'radians'}</strong>:
        </p>
        <Math
          value={`\\vec a = ${vector(props.question.a)}, \\qquad \\vec b = ${vector(props.question.b)}`}
          displayMode
        />
      </div>
      <div class="flex justify-center items-center gap-2">
        <Math value={`\\measuredangle(\\vec a, \\vec b) =`} />
        <Math name="attempt" editable value={props.attempt} />
        {props.question.unit === 'degrees' ? <Math value={`{\ }^\\circ`} /> : 'radians'}
      </div>
    </>
  ),
  question: z.object({
    a: z.string().or(z.number().transform(String)).array(),
    b: z.string().or(z.number().transform(String)).array(),
    unit: z.literal('degrees').or(z.literal('radians')).default('radians'),
  }),
  attempt: z.string().min(1),
  mark: async (question, attempt) => {
    'use server'
    const { vector } = await request(
      graphql(`
        query CheckAngle($a: [Math!]!, $b: [Math!]!, $attempt: Math!, $degrees: Boolean) {
          vector(coordinates: $a) {
            angle(coordinates: $b, degrees: $degrees) {
              isEqual(expr: $attempt)
            }
          }
        }
      `),
      { attempt, ...question, degrees: question.unit === 'degrees' },
    )
    return vector.angle.isEqual
  },
  generator: {
    params: z.object({
      Angles: z.string().or(z.number().transform(String)).array().nonempty(),
      Norms: z.string().or(z.number().transform(String)).array().nonempty(),
      EulerAngles: z.string().or(z.number().transform(String)).array().nonempty(),
      Units: z
        .literal('degrees')
        .or(z.literal('radians'))
        .array()
        .nonempty()
        .default(['degrees', 'radians']),
    }),
    generate: async (params) => {
      'use server'
      const unit = sample(params.Units)
      const a = [sample(params.Norms), '0', '0']
      const B = sample(params.Norms)
      const angle = sample(params.Angles)
      const b = [`(${B}) \\cos(${angle})`, `(${B}) \\sin(${angle})`, '0']
      const [phi, theta, psi] = [
        sample(params.EulerAngles),
        sample(params.EulerAngles),
        sample(params.EulerAngles),
      ]
      const data = await request(
        graphql(`
          query RotateVectors($a: [Math!]!, $b: [Math!]!, $phi: Math!, $theta: Math!, $psi: Math!) {
            a: vector(coordinates: $a) {
              eulerRotate(phi: $phi, theta: $theta, psi: $psi) {
                normalize {
                  expr {
                    expr
                  }
                }
              }
            }
            b: vector(coordinates: $b) {
              eulerRotate(phi: $phi, theta: $theta, psi: $psi) {
                normalize {
                  expr {
                    expr
                  }
                }
              }
            }
          }
        `),
        { a, b, phi, theta, psi },
      )
      return {
        a: data.a.eulerRotate.normalize.expr.map((e) => e.expr),
        b: data.b.eulerRotate.normalize.expr.map((e) => e.expr),
        unit,
      }
    },
  },
})

export { Component as default, schema }
