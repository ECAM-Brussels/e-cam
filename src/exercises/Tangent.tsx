import { query } from '@solidjs/router'
import { sample } from 'lodash-es'
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

export const mark = query(async (state: State): Promise<boolean> => {
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

export const solve = query(async (state: State): Promise<State> => {
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

type Params = {
  Data: { Expr: string[]; X0: string[] }[]
}

export function generate(params: Params): State {
  const data = sample(params.Data)!
  return {
    expr: sample(data.Expr)!,
    x0: sample(data.X0)!,
    normal: sample([true, false]) === true,
  }
}

export default function Tangent(props: ExerciseProps<State, Params>) {
  const x = () => props.state?.x || 'x'
  return (
    <ExerciseBase
      type="Tangent"
      {...props}
      schema={schema}
      mark={mark}
      solve={solve}
      generate={generate}
      solution={
        <p>
          La {props.state?.normal ? 'normale' : 'tangente'} a pour équation{' '}
          <Math value={props.feedback?.solution?.attempt} />
        </p>
      }
    >
      <p>
        Calculez la {props.state?.normal ? 'normale' : 'tangente'} de{' '}
        <Math value={`y = ${props.state?.expr}`} /> en{' '}
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
