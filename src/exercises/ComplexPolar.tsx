import { cache } from '@solidjs/router'
import { sample } from 'lodash-es'
import { z } from 'zod'
import ExerciseBase, { type ExerciseProps } from '~/components/ExerciseBase'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  expr: z.string().trim().min(1),
  attempt: z.string().optional(),
})
export type State = z.infer<typeof schema>

export const mark = cache(async (state: State) => {
  'use server'
  const { attempt } = await request(
    graphql(`
      query CheckComplexPolar($expr: Math!, $attempt: Math!) {
        attempt: expression(expr: $attempt) {
          isEqual(expr: $expr)
          isPolar
        }
      }
    `),
    { attempt: '', ...state },
  )
  return attempt.isEqual && attempt.isPolar
}, 'checkComplexPolar')

type Params = {
  R: (string | number)[]
  Theta: (string | number)[]
}

export async function generate(params: Params): Promise<State> {
  'use server'
  const r = sample(params.R)
  const theta = sample(params.Theta)
  const { expression } = await request(
    graphql(`
      query GeneratePolar($expr: Math!) {
        expression(expr: $expr) {
          expand {
            expr
          }
        }
      }
    `),
    { expr: `(${r}) (\\cos(${theta}) + i \\sin(${theta}))` },
  )
  return {
    expr: expression.expand.expr,
  }
}

export const solve = cache(async (state: State): Promise<State> => {
  'use server'
  const { expression } = await request(
    graphql(`
      query SolveComplexPolar($expr: Math!) {
        expression(expr: $expr) {
          abs {
            expr
          }
          arg {
            expr
          }
        }
      }
    `),
    state,
  )
  const r = expression.abs.expr
  const theta = expression.arg.expr
  return { ...state, attempt: `${r} e^{i \\left(${theta}\\right)}` }
}, 'solveComplexPolar')

export default function ComplexPolar(props: ExerciseProps<State, Params>) {
  return (
    <ExerciseBase
      type="ComplexPolar"
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
      <p>
        Écrivez <Math value={props.state?.expr} /> sous forme polaire.
      </p>
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
