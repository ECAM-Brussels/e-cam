import { query } from '@solidjs/router'
import { sample } from 'lodash-es'
import { z } from 'zod'
import ExerciseBase, { type ExerciseProps } from '~/components/ExerciseBase'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  expr: z.string().trim().min(1).describe('Expression'),
  attempt: z.string().trim().min(1).default(''),
})
export type State = z.infer<typeof schema>

export async function generate(params: {
  A: number[]
  B?: number[]
  X1: number[]
  X2: (number | 'x1' | '-x1')[]
  X3?: number[]
}): Promise<State> {
  'use server'
  const a = sample(params.A)
  const b = sample(params.B) || 1
  const x1 = sample(params.X1) as number
  let x2 = sample(params.X2) as number | 'x1' | '-x1'
  let expr = `${a}(${b}x - ${x1})`
  if (x2 === 'x1') {
    expr += `(${b}x - ${x1})`
  } else if (x2 === '-x1') {
    expr += `(${b}x + ${x1})`
  } else {
    expr += `(x - ${x2})`
  }
  if (params.X3 !== undefined) {
    const x3 = sample(params.X3) as number
    expr += `(x - ${x3})`
  }
  const { expression } = await request(
    graphql(`
      query GenerateFactorisation($expr: Math!) {
        expression(expr: $expr) {
          expand {
            expr
          }
        }
      }
    `),
    { expr },
  )
  return { expr: expression.expand.expr, attempt: '' }
}

export const mark = query(async (state: State) => {
  'use server'

  const { attempt } = await request(
    graphql(`
      query CheckFactorisation($expr: Math!, $attempt: Math!) {
        attempt: expression(expr: $attempt) {
          isEqual(expr: $expr)
          isFactored
        }
      }
    `),
    state,
  )
  return attempt.isEqual && attempt.isFactored
}, 'checkFactorisation')

export const solve = query(async (state: State): Promise<State> => {
  'use server'

  const { expression } = await request(
    graphql(`
      query SolveFactorisation($expr: Math!) {
        expression(expr: $expr) {
          factor {
            expr
          }
        }
      }
    `),
    { expr: state.expr },
  )
  return { ...state, attempt: expression.factor.expr }
}, 'solveFactorisation')

export default function Factor(props: ExerciseProps<State, Parameters<typeof generate>[0]>) {
  return (
    <ExerciseBase
      type="Factor"
      {...props}
      schema={schema}
      mark={mark}
      generate={generate}
      solve={solve}
      solution={
        <p>
          La solution est <Math value={props.feedback?.solution?.attempt} />.
        </p>
      }
    >
      <p>Factorisez l'expression.</p>
      <div class="flex items-center gap-2">
        <Math value={`${props.state?.expr}=`} />
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
