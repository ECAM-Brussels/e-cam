import { query } from '@solidjs/router'
import { random, sample, sampleSize } from 'lodash-es'
import { z } from 'zod'
import ExerciseBase, { type ExerciseProps } from '~/components/ExerciseBase'
import Maths from '~/components/Math'
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

type Params =
  | {
      type: 'integers'
      N: number
      K: number
      X: string[]
    }
  | {
      type: 'general'
      S: (number | string)[]
      X: string[]
    }

export async function generate(params: Params): Promise<State> {
  'use server'
  const unknown = sample(['a', 'b', 'c']) as 'a' | 'b' | 'c'
  const x = sample(params.X)!
  let a, b, c: string | number
  if (params.type === 'integers') {
    const m = random(1, params.N)
    const n = random(1, params.N)
    const k = random(1, params.K)
    a = k * (m ** 2 - n ** 2)
    a = a < 0 ? -a : a
    b = 2 * k * m * n
    c = k * (m ** 2 + n ** 2)
  } else {
    if (unknown === 'c') {
      a = sample(params.S)!
      b = sample(params.S)!
      c = x
    } else if (unknown === 'b') {
      const sides = sampleSize(params.S, 2)
      c = sides[0] > sides[1] ? sides[0] : sides[1]
      a = sides[0] > sides[1] ? sides[1] : sides[0]
      b = `\\sqrt{(${c})^2 - (${a})^2}`
    } else {
      const sides = sampleSize(params.S, 2)
      c = sides[0] > sides[1] ? sides[0] : sides[1]
      b = sides[0] > sides[1] ? sides[1] : sides[0]
      a = `\\sqrt{(${c})^2 - (${b})^2}`
    }
  }
  const query = await request(
    graphql(`
      query CalculateSides($a: Math!, $b: Math!) {
        a: expression(expr: $a) {
          evalf {
            expr
          }
        }
        b: expression(expr: $b) {
          evalf {
            expr
          }
        }
      }
    `),
    { a: String(a), b: String(b) },
  )
  let width = parseFloat(query.a.evalf.expr)
  let height = parseFloat(query.b.evalf.expr)
  let scale = width > height ? 400 / width : 400 / height
  const state = {
    a: String(a),
    b: String(b),
    c: String(c),
    height: Math.max(height * scale, 150),
    width: Math.max(width * scale, 150),
    unknown,
  }
  state[unknown] = x
  return state
}

export const mark = query(async (state: State) => {
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
  return expression.isEqual
}, 'checkPythagoras')

export default function Pythagoras(props: ExerciseProps<State, Params>) {
  return (
    <ExerciseBase type="Pythagoras" {...props} schema={schema} mark={mark} generate={generate}>
      <p>
        Trouvez la valeur de <Maths value={props.state?.[props.state?.unknown]} />
      </p>
      <RightTriangle
        a={props.state?.a}
        b={props.state?.b}
        c={props.state?.c}
        height={props.state?.height || 400}
        width={props.state?.width || 400}
      />
      <div class="flex items-center gap-2">
        <Maths value={`${props.state?.[props.state?.unknown]}=`} />
        <Maths
          class="border w-64"
          editable={!props.options?.readOnly}
          value={props.state?.attempt}
          onBlur={(e) => props.setter?.('state', 'attempt', e.target.value)}
        />
      </div>
    </ExerciseBase>
  )
}
