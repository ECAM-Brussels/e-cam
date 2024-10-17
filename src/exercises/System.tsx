import { cache } from '@solidjs/router'
import dedent from 'dedent-js'
import { sample } from 'lodash-es'
import { For, Show } from 'solid-js'
import { z } from 'zod'
import ExerciseBase, { type ExerciseProps } from '~/components/ExerciseBase'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  equations: z.string().array(),
  variables: z.string().array(),
  impossible: z.boolean().optional(),
  attempt: z.string().array().optional(),
})
export type State = z.infer<typeof schema>

export const mark = cache(async (state: State) => {
  'use server'
  const { system } = await request(
    graphql(`
      query CheckSystem($equations: [Math!]!, $variables: [Math!]!, $attempt: [Math!]!) {
        system {
          check(equations: $equations, variables: $variables, x: $attempt)
          solve(equations: $equations, variables: $variables) {
            expr
          }
        }
      }
    `),
    { attempt: [], ...state },
  )
  if (system.solve.length === 0) {
    return state.impossible === true
  }
  return !state.impossible && system.check
}, 'checkSystem')

export const solve = cache(async (state: State): Promise<State> => {
  'use server'
  const { system } = await request(
    graphql(`
      query SolveSystem($equations: [Math!]!, $variables: [Math!]!) {
        system {
          solve(equations: $equations, variables: $variables) {
            expr
          }
        }
      }
    `),
    state,
  )
  return {
    ...state,
    attempt: system.solve.map((sol) => sol.expr),
    impossible: system.solve.length === 0,
  }
}, 'solveSystem')

type Params = {
  variables: string[]
  /**
   * Contains the opposite of the elimination factors in the Gaussian elimination
   */
  L: string[]
  U: string[]
  /**
   * Admissible values for the coordinates of the solution
   */
  X: string[]
  /**
   * Upper-bound on the number of required Gaussian eliminations
   */
  eliminationCount?: number

  Impossible?: boolean[]
  NullRows?: number[]
}

export async function generate(params: Params): Promise<State> {
  'use server'
  const impossible = sample(params.Impossible || [false])!
  let nullRows = sample(params.NullRows || [0])!
  if (nullRows === 0 && impossible) {
    nullRows += 1
  }
  const { system } = await request(
    graphql(`
      query GenerateSystem(
        $variables: [Math!]!
        $L: [Math!]!
        $U: [Math!]!
        $X: [Math!]!
        $eliminationCount: Int
        $zeroRows: Int
        $impossible: Boolean
      ) {
        system {
          generate(
            variables: $variables
            Lentries: $L
            Uentries: $U
            X: $X
            eliminationCount: $eliminationCount
            zeroRows: $zeroRows
            impossible: $impossible
          )
        }
      }
    `),
    { eliminationCount: null, zeroRows: nullRows, impossible, ...params },
  )
  return {
    equations: system.generate,
    variables: params.variables,
    attempt: Array(params.variables.length).fill(''),
  }
}

export default function System(props: ExerciseProps<State, Params>) {
  const system = () => dedent`
    \\begin{cases}
    ${props.state?.equations.join('\\\\')}
    \\end{cases}
  `

  return (
    <ExerciseBase
      type="System"
      {...props}
      schema={schema}
      mark={mark}
      generate={generate}
      solve={solve}
      solution={
        <>
          La solution est{' '}
          <Math value={`\\left(${props.feedback?.solution?.attempt?.join(',')}\\right)`} />
        </>
      }
    >
      <p>Résolvez le système suivant:</p>
      <Math value={system()} displayMode />
      <p>
        <input
          type="checkbox"
          onChange={(e) => props.setter('state', 'impossible', e.target.checked)}
          checked={props.state?.impossible}
        />{' '}
        Ce système est impossible
      </p>
      <Show when={props.state?.impossible !== true}>
        <For each={props.state?.variables || []}>
          {(variable, i) => (
            <p>
              <Math value={`${variable} =`} />
              <Math
                class="border w-64"
                editable={!props.options?.readOnly}
                value={props.state?.attempt?.[i()]}
                onBlur={(e) => props.setter('state', 'attempt', i(), e.target.value)}
              />
            </p>
          )}
        </For>
      </Show>
    </ExerciseBase>
  )
}
