import { query } from '@solidjs/router'
import { sample } from 'lodash-es'
import { z } from 'zod'
import ExerciseBase, { ExerciseProps } from '~/components/ExerciseBase'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  a: z.string().array(),
  b: z.string().array(),
  attempt: z.string().array().optional(),
})
export type State = z.infer<typeof schema>

type Params = { numbers: string[] }
export function generate(params: Params): State {
  return {
    a: [sample(params.numbers)!, sample(params.numbers)!, sample(params.numbers)!],
    b: [sample(params.numbers)!, sample(params.numbers)!, sample(params.numbers)!],
  }
}

export const mark = query(async (state: State) => {
  'use server'
  const { vector } = await request(
    graphql(`
      query CheckCrossProduct($a: [Math!]!, $b: [Math!]!, $attempt: [Math!]!) {
        vector(coordinates: $a) {
          cross(coordinates: $b) {
            isEqual(coordinates: $attempt)
          }
        }
      }
    `),
    { attempt: '', ...state },
  )
  return vector.cross.isEqual
}, 'checkCrossProduct')

export const solve = query(async (state: State): Promise<State> => {
  'use server'
  const { vector } = await request(
    graphql(`
      query SolveCrossProduct($a: [Math!]!, $b: [Math!]!) {
        vector(coordinates: $a) {
          cross(coordinates: $b) {
            coordinates
          }
        }
      }
    `),
    state,
  )
  return { ...state, attempt: vector.cross.coordinates }
}, 'solveCrossProduct')

export default function CrossProduct(props: ExerciseProps<State, Params>) {
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
  const c = () => String.raw`
    \begin{pmatrix}
      \placeholder[c1]{${props.state?.attempt?.[0] || ''}}\\
      \placeholder[c2]{${props.state?.attempt?.[1] || ''}}\\
      \placeholder[c3]{${props.state?.attempt?.[2] || ''}}\\
    \end{pmatrix}
  `
  return (
    <ExerciseBase
      type="CrossProduct"
      {...props}
      schema={schema}
      mark={mark}
      generate={generate}
      solve={solve}
      solution={
        <>
          La réponse est{' '}
          <Math
            value={`\\begin{pmatrix} ${props.feedback?.solution?.attempt?.join('\\\\ ') || ''} \\end{pmatrix}`}
          />
        </>
      }
    >
      <p>Calculez le produit vectoriel suivant</p>
      <div class="flex items-center gap-2">
        <Math value={`${a()} \\times ${b()} =`} displayMode />
        <Math
          value={c()}
          editable
          displayMode
          readOnly
          onBlur={(e) => {
            const el = e.target
            props.setter('state', 'attempt', [
              el.getPromptValue('c1'),
              el.getPromptValue('c2'),
              el.getPromptValue('c3'),
            ])
          }}
        />
      </div>
    </ExerciseBase>
  )
}
