import { cache } from '@solidjs/router'
import dedent from 'dedent-js'
import { sample } from 'lodash-es'
import { For } from 'solid-js'
import { z } from 'zod'
import ExerciseBase, { type ExerciseProps } from '~/components/ExerciseBase'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  equations: z.string().array(),
  variables: z.string().array(),
  attempt: z.string().array(),
})
export type State = z.infer<typeof schema>

export const mark = cache(async (state: State) => {
  'use server'
  const { system } = await request(
    graphql(`
      query CheckSystem($equations: [Math!]!, $variables: [Math!]!, $attempt: [Math!]!) {
        system {
          check(equations: $equations, variables: $variables, x: $attempt)
        }
      }
    `),
    state,
  )
  return system.check
}, 'checkSystem')

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
}

export async function generate(params: Params): Promise<State> {
  'use server'
  const { system } = await request(
    graphql(`
      query GenerateSystem(
        $variables: [Math!]!
        $L: [Math!]!
        $U: [Math!]!
        $X: [Math!]!
        $eliminationCount: Int
      ) {
        system {
          generate(
            variables: $variables
            Lentries: $L
            Uentries: $U
            X: $X
            eliminationCount: $eliminationCount
          )
        }
      }
    `),
    { eliminationCount: null, ...params },
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
    <ExerciseBase type="System" {...props} schema={schema} mark={mark} generate={generate}>
      <p>Résolvez le système suivant:</p>
      <Math value={system()} displayMode />
      <For each={props.state?.variables || []}>
        {(variable, i) => (
          <p>
            <Math value={`${variable} =`} />
            <Math
              class="border w-64"
              editable={!props.options?.readOnly}
              value={props.state?.attempt[i()]}
              onBlur={(e) => props.setter('state', 'attempt', i(), e.target.value)}
            />
          </p>
        )}
      </For>
    </ExerciseBase>
  )
}
