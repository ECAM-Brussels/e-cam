import { cache } from '@solidjs/router'
import { z } from 'zod'
import ExerciseBase, { type ExerciseProps } from '~/components/ExerciseBase'
import Math from '~/components/Math'
import RightTriangle from '~/components/RightTriangle'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  a: z.string().optional(),
  b: z.string().optional(),
  c: z.string().optional(),
  unknown: z.literal('a').or(z.literal('b')).or(z.literal('c')),
  attempt: z.string().optional(),
})
type State = z.infer<typeof schema>

export const mark = cache(async (state: State) => {
  'use server'
  const data = {...state}
  data[state.unknown] = state.attempt
  const expr = `(${data.a})^2 + (${data.b})^2 - (${data.c})^2`
  const { expression } = await request(
    graphql(`
      query CheckPythagoras($expr: Math!) {
        expression(expr: $expr) {
          isEqual(expr: "0")
        }
      }
    `),
    { expr },
  )
  console.log(expr, expression)
  return expression.isEqual
}, 'checkPythagoras')

export default function Pythagoras(props: ExerciseProps<State, null>) {
  return (
    <ExerciseBase type="Pythagoras" {...props} schema={schema} mark={mark}>
      <p>
        Trouvez la valeur de <Math value={props.state?.[props.state?.unknown]} />
      </p>
      <RightTriangle
        a={props.state?.a}
        b={props.state?.b}
        c={props.state?.c}
        height={400}
        width={400}
      />
      <div class="flex items-center gap-2">
        <Math value={`${props.state?.[props.state?.unknown]}=`} />
        <Math
          class="border w-64"
          editable={!props.options?.readOnly}
          value={props.state?.attempt}
          onBlur={(e) => props.setter?.('state', 'attempt', e.target.value)}
        />
      </div>
    </ExerciseBase>
  )
}
