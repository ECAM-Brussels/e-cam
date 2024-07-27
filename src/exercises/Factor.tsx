import { cache } from '@solidjs/router'
import { sample } from 'lodash-es'
import { z } from 'zod'
import ExerciseBase, { type ExerciseProps } from '~/components/ExerciseBase'
import Math from '~/components/Math'
import Tick from '~/components/Tick'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  expr: z.string().trim().min(1).describe('Expression'),
  attempt: z.string().trim().min(1).default(''),
})
export type State = z.infer<typeof schema>

export async function generate(params: {
  A: number[]
  X1: number[]
  X2: number[]
}): Promise<State> {
  const a = sample(params.A)
  const x1 = sample(params.X1)
  const x2 = sample(params.X2)
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
    { expr: `${a}(x - ${x1})(x - ${x2})` },
  )
  return { expr: expression.expand.expr, attempt: '' }
}

export const mark = cache(async (state: State) => {
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

export default function Factor(props: ExerciseProps<State, Parameters<typeof generate>[0]>) {
  return (
    <ExerciseBase type="Factor" {...props} schema={schema} mark={mark} generate={generate}>
      <p>
        Factorisez <Math value={props.state?.expr} />
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
      <Tick value={props.feedback?.correct} />
    </ExerciseBase>
  )
}
