import { z } from 'zod'
import Exercise, { type ExerciseProps } from '~/components/Exercise'
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
      <Math
        editable
        value={props.state?.attempt[0]}
        onBlur={(e) => props.setter?.('state', 'attempt', [e.target.value])}
      />
      <Tick value={props.feedback?.correct} />
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </Exercise>
  )
}
