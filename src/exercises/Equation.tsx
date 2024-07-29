import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { For } from 'solid-js'
import { z } from 'zod'
import ExerciseBase, { type ExerciseProps } from '~/components/ExerciseBase'
import Fa from '~/components/Fa'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  equation: z.string().describe('Equation'),
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
    <ExerciseBase type="Equation" {...props} schema={schema} mark={mark}>
      <p>
        Résolvez l'équation <Math value={props.state?.equation} />
      </p>
      <div class="grid grid-cols-3 gap-2">
        <For each={props.state?.attempt}>
          {(attempt, i) => (
            <label class="flex items-center gap-1">
              <Math value="x =" />
              <Math
                editable={!props.options?.readOnly}
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
          <Fa icon={faPlus} /> Ajouter une solution
        </button>
        <button
          onClick={() => {
            if (props.state) {
              props.setter?.('state', 'attempt', props.state.attempt.toSpliced(-1, 1))
            }
          }}
        >
          <Fa icon={faTrashAlt} /> Supprimer la dernière solution
        </button>
      </div>
    </ExerciseBase>
  )
}
