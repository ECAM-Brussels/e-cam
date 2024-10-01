import { cache } from '@solidjs/router'
import { z } from 'zod'
import ExerciseBase, { type ExerciseProps } from '~/components/ExerciseBase'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  expr: z.string(),
  x: z.string().optional(),
  x0: z.string(),
  normal: z.boolean().optional(),
  attempt: z.string().optional(),
})
export type State = z.infer<typeof schema>

export const mark = cache(async (state: State): Promise<boolean> => {
  'use server'
  const { expression } = await request(
    graphql(`
      query CheckTangent($expr: Math!, $attempt: Math!, $x0: Math!, $x: Math, $normal: Boolean) {
        expression(expr: $expr) {
          tangent(x0: $x0, x: $x, normal: $normal) {
            isEqual(expr: $attempt)
          }
        }
      }
    `),
    { attempt: '', ...state },
  )
  return expression.tangent.isEqual
}, 'checkTangent')

export const solve = cache(async (state: State): Promise<State> => {
  'use server'
  const { expression } = await request(
    graphql(`
      query CalculateTangent($expr: Math!, $x0: Math!, $x: Math, $normal: Boolean) {
        expression(expr: $expr) {
          tangent(x0: $x0, x: $x, normal: $normal) {
            expr
          }
        }
      }
    `),
    state,
  )
  return { ...state, attempt: expression.tangent.expr }
}, 'solveTangent')

export default function Tangent(props: ExerciseProps<State, null>) {
  const x = () => props.state?.x || 'x'
  return (
    <ExerciseBase
      type="Tangent"
      {...props}
      schema={schema}
      mark={mark}
      solve={solve}
      solution={
        <p>
          La tangente a pour équation <Math value={props.feedback?.solution?.attempt} />
        </p>
      }
    >
      <p>
        Calculez la tangente de <Math value={`y = ${props.state?.expr}`} /> en{' '}
        <Math value={`${x()} = ${props.state?.x0}`} />
      </p>
      <div class="flex items-center gap-2">
        <span>Réponse:</span>
        <Math
          class="border w-64"
          editable={!props.options?.readOnly}
          value={props.state?.attempt}
          onBlur={(e) => props.setter?.('state', 'attempt', e.target.value)}
        />
      </div>
    </ExerciseBase>
  )
}
