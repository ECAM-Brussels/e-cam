import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { cache } from '@solidjs/router'
import { sample } from 'lodash-es'
import { For, Show } from 'solid-js'
import { z } from 'zod'
import ExerciseBase, { type ExerciseProps } from '~/components/ExerciseBase'
import Fa from '~/components/Fa'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  equation: z.string().describe('Equation'),
  attempt: z.string().array().optional(),
  a: z.string().optional(),
  b: z.string().optional(),
})
export type State = z.infer<typeof schema>

export const mark = cache(async (state: State) => {
  'use server'

  const { equation } = await request(
    graphql(`
      query CheckEquationSolution($equation: Math!, $attempt: [Math!]!, $a: Math, $b: Math) {
        equation: expression(expr: $equation) {
          solveset(a: $a, b: $b) {
            isSetEqual(items: $attempt)
          }
        }
      }
    `),
    { attempt: [], ...state },
  )
  return equation.solveset.isSetEqual
}, 'checkEquation')

type Params = {
  type: 'trigonometric'
  F: ('cos' | 'sin' | 'tan' | 'cot')[]
  A: (number | string)[]
  B: (number | string)[]
  C: (number | string)[]
  Interval: [number | string, number | string][]
}

export async function generate(params: Params) {
  'use server'
  const f = sample(params.F)
  const a = sample(params.A)
  const b = sample(params.B)
  const c = sample(params.C)
  const I = sample(params.Interval)!
  const { expression } = await request(
    graphql(`
      query CalculateArg($expr: Math!) {
        expression(expr: $expr) {
          simplify {
            expr
          }
        }
      }
    `),
    { expr: `(${a}) x + ${b}` },
  )
  const arg = expression.simplify.expr
  return {
    equation: `\\${f}\\left(${arg}\\right) = ${c}`,
    a: String(I[0]),
    b: String(I[1]),
  }
}

export default function Equation(props: ExerciseProps<State, Params>) {
  return (
    <ExerciseBase type="Equation" {...props} schema={schema} mark={mark} generate={generate}>
      <p>
        Résolvez l'équation <Math value={props.state?.equation} />
        <Show when={props.state?.a && props.state?.b}>
          {' '}
          sur l'intervalle <Math value={`\\left[${props.state?.a}, ${props.state?.b}\\right]`} />
        </Show>
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
              if (props.state.attempt) {
                props.setter?.('state', 'attempt', props.state?.attempt.length, '')
              } else {
                props.setter?.('state', 'attempt', [''])
              }
            }
          }}
        >
          <Fa icon={faPlus} /> Ajouter une solution
        </button>
        <button
          onClick={() => {
            if (props.state && props.state.attempt) {
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
