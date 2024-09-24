import { cache } from '@solidjs/router'
import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import ExerciseBase, { ExerciseProps } from '~/components/ExerciseBase'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  a: z.string().array(),
  b: z.string().array(),
  attempt: z.string().optional(),
  degrees: z.boolean().optional(),
  error: z.number(),
})
export type State = z.infer<typeof schema>

type Params = {
  Coordinates: string[]
  error?: number
  Unit?: ('degree' | 'radian')[]
}
export function generate(params: Params): State {
  const degrees = sample(params.Unit || ['degree'])! === 'degree'
  return {
    a: [sample(params.Coordinates)!, sample(params.Coordinates)!, sample(params.Coordinates)!],
    b: [sample(params.Coordinates)!, sample(params.Coordinates)!, sample(params.Coordinates)!],
    error: params.error || 0,
    degrees,
  }
}

export const mark = cache(async (state: State) => {
  'use server'
  const { vector } = await request(
    graphql(`
      query CheckAngle(
        $a: [Math!]!
        $b: [Math!]!
        $attempt: Math!
        $degrees: Boolean
        $error: Float!
      ) {
        vector(coordinates: $a) {
          angle(coordinates: $b, degrees: $degrees) {
            isApproximatelyEqual(expr: $attempt, error: $error)
          }
        }
      }
    `),
    { attempt: '', ...state, degrees: state.degrees === true },
  )
  return vector.angle.isApproximatelyEqual
}, 'CheckAngle')

export default function VectorAngle(props: ExerciseProps<State, Params>) {
  const a = () => String.raw`
    \begin{pmatrix}
      ${props.state?.a[0]} \\
      ${props.state?.a[1]} \\
      ${props.state?.a[2]} \\
    \end{pmatrix}
  `
  const b = () => String.raw`
    \begin{pmatrix}
      ${props.state?.b[0]} \\
      ${props.state?.b[1]} \\
      ${props.state?.b[2]} \\
    \end{pmatrix}
  `
  return (
    <ExerciseBase type="VectorAngle" {...props} schema={schema} mark={mark} generate={generate}>
      <p>
        Trouvez l'angle entre les vecteurs suivants en{' '}
        <strong>
          <Show when={props.state?.degrees} fallback={<>radians</>}>
            degrés
          </Show>
        </strong>
      </p>
      <Math value={`${a()}, \\quad ${b()}`} />
      <p class="flex items-center gap-2 mt-4">
        <Math value={`\\theta =`} />
        <Math
          class="border w-64"
          editable={!props.options?.readOnly}
          value={props.state?.attempt}
          onBlur={(e) => props.setter?.('state', 'attempt', e.target.value)}
        />
      </p>
      <p class="mt-4 text-sm">(Erreur tolérée: {props.state?.error})</p>
    </ExerciseBase>
  )
}
