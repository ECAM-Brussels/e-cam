import { query } from '@solidjs/router'
import { sample } from 'lodash-es'
import { z } from 'zod'
import ExerciseBase, { ExerciseProps } from '~/components/ExerciseBase'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  expr: z.string().trim().min(1),
  attempt: z.string().trim().optional(),
})
export type State = z.infer<typeof schema>

export const mark = query(async (state: State) => {
  'use server'

  const { expression } = await request(
    graphql(`
      query CheckDerivative($expr: Math!, $attempt: Math!) {
        expression(expr: $expr) {
          diff {
            isEqual(expr: $attempt)
          }
        }
      }
    `),
    { attempt: '', ...state },
  )
  return expression.diff.isEqual
}, 'checkDerivative')

export const solve = query(async (state: State): Promise<State> => {
  'use server'

  const { expression } = await request(
    graphql(`
      query Differentiate($expr: Math!) {
        expression(expr: $expr) {
          diff {
            expr
          }
        }
      }
    `),
    { attempt: '', ...state },
  )
  return { ...state, attempt: expression.diff.expr }
}, 'solveDerivative')

type Params = { Expr: string[] }
export function generate(params: Params): State {
  return {
    expr: sample(params.Expr)!,
  }
}

export default function Differentiate(props: ExerciseProps<State, Params>) {
  return (
    <ExerciseBase
      type="Differentiate"
      {...props}
      schema={schema}
      mark={mark}
      solve={solve}
      generate={generate}
      solution={
        <p>
          La solution est <Math value={props.feedback?.solution?.attempt} />.
        </p>
      }
    >
      <p>
        Dérivez l'expression <Math value={props.state?.expr} />
      </p>
      <div class="flex items-center gap-2">
        <Math
          value={String.raw`\frac{\mathrm{d}}{\mathrm{d} x} \left( ${props.state?.expr} \right) =`}
          displayMode
        />
        <Math
          class="border w-64"
          editable={!props.options?.readOnly}
          value={props.state?.attempt}
          onBlur={(e) => props.setter('state', 'attempt', e.target.value)}
        />
      </div>
    </ExerciseBase>
  )
}
