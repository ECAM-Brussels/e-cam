import { query } from '@solidjs/router'
import { sample } from 'lodash-es'
import { z } from 'zod'
import ExerciseBase, { type ExerciseProps } from '~/components/ExerciseBase'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  expr: z.string().trim().min(1).describe('Expression'),
  attempt: z.string().trim().min(1),
})
export type State = z.infer<typeof schema>

export async function generate(params: {
  A: (number | string)[]
  Alpha: (number | string)[]
  Beta: (number | string)[]
}): Promise<State> {
  'use server'
  const a = sample(params.A)
  const alpha = sample(params.Alpha)
  const beta = sample(params.Beta)
  const { expression } = await request(
    graphql(`
      query GenerateSquare($expr: Math!) {
        expression(expr: $expr) {
          expand {
            expr
          }
        }
      }
    `),
    { expr: `${a}(x - ${alpha})^2 + ${beta}` },
  )
  return { expr: expression.expand.expr, attempt: '' }
}

export const mark = query(async (state: State) => {
  'use server'

  const { attempt } = await request(
    graphql(`
      query CheckSquare($expr: Math!, $attempt: Math!) {
        attempt: expression(expr: $attempt) {
          isEqual(expr: $expr)
          count(expr: "x")
        }
      }
    `),
    state,
  )
  return attempt.isEqual && attempt.count == 1
}, 'checkSquare')

export const solve = query(async (state: State) => {
  'use server'

  const { expression } = await request(
    graphql(`
      query CompleteSquare($expr: Math!) {
        expression(expr: $expr) {
          completeSquare {
            expr
          }
        }
      }
    `),
    state,
  )
  return { ...state, attempt: expression.completeSquare.expr }
}, 'completeSquare')

export default function CompleteSquare(
  props: ExerciseProps<State, Parameters<typeof generate>[0]>,
) {
  return (
    <ExerciseBase
      type="CompleteSquare"
      {...props}
      schema={schema}
      mark={mark}
      generate={generate}
      solve={solve}
      solution={
        <>
          La réponse est <Math value={`${props.feedback?.solution?.attempt}`} />
        </>
      }
    >
      <p>Complétez le carré dans l'expression suivante.</p>
      <div class="flex items-center gap-2">
        <Math value={`${props.state?.expr} =`} />
        <Math
          class="border w-1/2"
          editable={!props.options?.readOnly}
          value={props.state?.attempt}
          onBlur={(e) => props.setter?.('state', 'attempt', e.target.value)}
        />
      </div>
    </ExerciseBase>
  )
}
