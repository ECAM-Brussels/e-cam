import { cache } from '@solidjs/router'
import { random, sample } from 'lodash-es'
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
  width: z.number().optional(),
  height: z.number().optional(),
})
type State = z.infer<typeof schema>

type Params = {
  type: 'integers'
  N: number
  K: number
  X: string[]
}

export function generate(params: Params): State {
  const m = random(1, params.N)
  const n = random(1, params.N)
  const k = random(1, params.K)
  const x = sample(params.X)!
  let a = k * (m ** 2 - n ** 2)
  let b = 2 * k * m * n
  let c = k * (m ** 2 + n ** 2)
  const width = 400
  const height = (width * b) / a
  const unknown = sample(['a', 'b', 'c']) as 'a' | 'b' | 'c'
  const state = {
    a: String(a),
    b: String(b),
    c: String(c),
    height,
    width,
    unknown,
  }
  state[unknown] = x
  return state
}

export const mark = cache(async (state: State) => {
  'use server'
  const data = { ...state }
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

export default function Pythagoras(props: ExerciseProps<State, Params>) {
  return (
    <ExerciseBase type="Pythagoras" {...props} schema={schema} mark={mark} generate={generate}>
      <p>
        Trouvez la valeur de <Math value={props.state?.[props.state?.unknown]} />
      </p>
      <RightTriangle
        a={props.state?.a}
        b={props.state?.b}
        c={props.state?.c}
        height={props.state?.height || 400}
        width={props.state?.width || 400}
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
