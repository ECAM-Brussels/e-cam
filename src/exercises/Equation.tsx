import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { For } from 'solid-js'
import { z } from 'zod'
import Exercise, { type ExerciseProps } from '~/components/Exercise'
import Fa from '~/components/Fa'
import Math from '~/components/Math'
import Tick from '~/components/Tick'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  equation: z.string(),
  attempt: z.string().array(),
})
export type State = z.infer<typeof schema>

export const mark = async (state: State) => {
  'use server'

  const { equation } = await request(
    graphql(`
      query CheckEquationSolution($equation: Math!, $attempt: [Math!]!) {
        equation: expression(expr: $equation) {
          solveset {
            isSetEqual(items: $attempt)
          }
        }
      }
    `),
    state,
  )
  return equation.solveset.isSetEqual
}

export default function Equation(props: ExerciseProps<State, undefined>) {
  return (
    <Exercise {...props} schema={schema} mark={mark}>
      <p>
        Solve <Math value={props.state?.equation} />
      </p>
      <div class="grid grid-cols-3 gap-2">
        <For each={props.state?.attempt}>
          {(attempt, i) => (
            <label class="flex items-center">
              <Math value="x =" />
              <Math
                editable
                value={attempt}
                onBlur={(e) => props.setter?.('state', 'attempt', i(), e.target.value)}
              />
            </label>
          )}
        </For>
      </div>
      <div class="text-gray-500 text-xs flex gap-2">
        <button
          onClick={() => {
            if (props.state) {
              props.setter?.('state', 'attempt', props.state?.attempt.length, '')
            }
          }}
        >
          <Fa icon={faPlus} /> Add a solution
        </button>
        <button
          onClick={() => {
            if (props.state) {
              props.setter?.('state', 'attempt', props.state.attempt.toSpliced(-1, 1))
            }
          }}
        >
          <Fa icon={faTrashAlt} /> Remove last solution
        </button>
      </div>
      <Tick value={props.feedback?.correct} />
    </Exercise>
  )
}
