import { query } from '@solidjs/router'
import { z } from 'zod'
import ExerciseBase, { type ExerciseProps } from '~/components/ExerciseBase'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  expr: z.string(),
  x: z.string().optional(),
  x0: z.string(),
  attempt: z.string().optional(),
})
export type State = z.infer<typeof schema>

export const mark = query(async (state: State) => {
  'use server'
  const { expression } = await request(
    graphql(`
      query CheckLimit($expr: Math!, $attempt: Math!, $x0: Math!, $x: Math) {
        expression(expr: $expr) {
          limit(x0: $x0, x: $x) {
            isEqual(expr: $attempt)
          }
        }
      }
    `),
    { attempt: '', ...state },
  )
  return expression.limit.isEqual
}, 'checkLimit')

export const solve = query(async (state: State) => {
  'use server'
  const { expression } = await request(
    graphql(`
      query CalculateLimit($expr: Math!, $x0: Math!, $x: Math) {
        expression(expr: $expr) {
          limit(x0: $x0, x: $x) {
            expr
          }
        }
      }
    `),
    state,
  )
  return { ...state, attempt: expression.limit.expr }
}, 'solveLimit')

export default function Limit(props: ExerciseProps<State, null>) {
  const x = () => props.state?.x || 'x'
  return (
    <ExerciseBase
      type="Limit"
      {...props}
      schema={schema}
      mark={mark}
      solve={solve}
      solution={
        <p>
          La réponse est <Math value={props.feedback?.solution?.attempt} />
        </p>
      }
    >
      <p>Calculez la limite suivante.</p>
      <div class="flex items-center gap-2">
        <Math value={`\\lim_{${x()} \\to ${props.state?.x0}} ${props.state?.expr} =`} displayMode />
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
