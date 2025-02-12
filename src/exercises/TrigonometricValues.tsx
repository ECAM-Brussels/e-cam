import { query } from '@solidjs/router'
import { sample } from 'lodash-es'
import { z } from 'zod'
import ExerciseBase, { ExerciseProps } from '~/components/ExerciseBase'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  expr: z.string(),
  attempt: z.string().optional(),
})
export type State = z.infer<typeof schema>

export async function generate(params: {
  F?: ('cos' | 'sin' | 'tan' | 'cot')[]
  Alpha: string[]
  Q?: number[]
  K?: number[]
}): Promise<State> {
  'use server'
  const f = sample(params.F || ['cos', 'sin', 'tan', 'cot'])
  const q = sample(params.Q || [1, 2, 3, 4]) as 1 | 2 | 3 | 4
  const k = sample(params.K || [0])

  let alpha = sample(params.Alpha)!
  alpha = ['0', alpha, `\\pi - ${alpha}`, `\\pi + ${alpha}`, `-${alpha}`][q]
  alpha += `+ 2 \\times ${k} \\pi`
  const { expression } = await request(
    graphql(`
      query CalculateAngle($expr: Math!) {
        expression(expr: $expr) {
          simplify {
            expr
          }
        }
      }
    `),
    { expr: alpha },
  )
  alpha = expression.simplify.expr

  return {
    expr: `\\${f} \\left( ${alpha} \\right)`,
  }
}

export const mark = query(async (state: State) => {
  'use server'

  const { attempt } = await request(
    graphql(`
      query CheckTrigonometricValue($expr: Math!, $attempt: Math!) {
        attempt: expression(expr: $attempt) {
          isEqual(expr: $expr)
          isNumber
        }
      }
    `),
    { attempt: '', ...state },
  )
  return attempt.isEqual && attempt.isNumber
}, 'checkTrigonometricValue')

export const solve = query(async (state: State) => {
  'use server'

  const { expression } = await request(
    graphql(`
      query SolveTrigonometricValue($expr: Math!) {
        expression(expr: $expr) {
          simplify {
            expr
          }
        }
      }
    `),
    state,
  )
  return { ...state, attempt: expression.simplify.expr }
}, 'checkTrigonometricValue')

export default function TrigonometricValues(
  props: ExerciseProps<State, Parameters<typeof generate>[0]>,
) {
  return (
    <ExerciseBase
      type="TrigonometricValues"
      {...props}
      schema={schema}
      mark={mark}
      generate={generate}
      solve={solve}
      solution={
        <p>
          La réponse est <Math value={props.feedback?.solution?.attempt} />
        </p>
      }
    >
      <Table />
      <p>
        Sans utiliser la calculatrice mais en employant le tableau ci-dessus, donnez la valeur
        exacte du nombre trigonométrique suivant.
      </p>
      <div class="flex items-center gap-2">
        <Math value={`${props.state?.expr}=`} displayMode />
        <Math
          class="border w-64"
          displayMode
          editable={!props.options?.readOnly}
          value={props.state?.attempt}
          onBlur={(e) => props.setter?.('state', 'attempt', e.target.value)}
        />
      </div>
    </ExerciseBase>
  )
}

function Table() {
  const functions = ['sin', 'cos', 'tan']
  const angles = ''
  return (
    <table class="border container text-center mb-8">
      <thead>
        <tr class="border-b">
          <th class="border-e"></th>
          <th>
            <Math value="0" />
          </th>
          <th>
            <Math value="\frac {\pi} 6" />
          </th>
          <th>
            <Math value="\frac {\pi} 4" />
          </th>
          <th>
            <Math value="\frac {\pi} 3" />
          </th>
          <th>
            <Math value="\frac {\pi} 2" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th class="border-r">
            <Math value="\sin" />
          </th>
          <td>
            <Math value="0" />
          </td>
          <td>
            <Math value="\frac 1 2" />
          </td>
          <td>
            <Math value="\frac {\sqrt 2} 2" />
          </td>
          <td>
            <Math value="\frac {\sqrt 3} 2" />
          </td>
          <td>
            <Math value="1" />
          </td>
        </tr>
        <tr>
          <th class="border-r">
            <Math value="\cos" />
          </th>
          <td>
            <Math value="1" />
          </td>
          <td>
            <Math value="\frac {\sqrt 3} 2" />
          </td>
          <td>
            <Math value="\frac {\sqrt 2} 2" />
          </td>
          <td>
            <Math value="\frac 1 2" />
          </td>
          <td>
            <Math value="0" />
          </td>
        </tr>
        <tr>
          <th class="border-r">
            <Math value="\tan" />
          </th>
          <td>
            <Math value="0" />
          </td>
          <td>
            <Math value="\frac {\sqrt 3} 3" />
          </td>
          <td>
            <Math value="1" />
          </td>
          <td>
            <Math value="\sqrt 3" />
          </td>
          <td>
            <Math value="\nexists" />
          </td>
        </tr>
      </tbody>
    </table>
  )
}
