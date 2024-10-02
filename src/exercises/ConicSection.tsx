import { cache } from '@solidjs/router'
import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import ExerciseBase, { ExerciseProps } from '~/components/ExerciseBase'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const schema = z.object({
  equation: z.string(),
  attempt: z
    .object({
      type: z.literal('parabola').or(z.literal('ellipse')).or(z.literal('hyperbola')),
      center: z.string(),
      foci: z.string().array(),
      vertices: z.string().array(),
    })
    .optional(),
})
export type State = z.infer<typeof schema>

export const mark = cache(async (state: State) => {
  'use server'
  const { conicSection } = await request(
    graphql(`
      query CheckConicSection(
        $equation: Math!
        $center: Math!
        $vertices: [Math!]!
        $foci: [Math!]!
      ) {
        conicSection(equation: $equation) {
          type
          center {
            isEqual(expr: $center)
          }
          vertices {
            isSetEqual(items: $vertices)
          }
          foci {
            isSetEqual(items: $foci)
          }
        }
      }
    `),
    {
      equation: state.equation,
      center: state.attempt?.center || '',
      foci: state.attempt?.foci || [],
      vertices: state.attempt?.vertices || [],
    },
  )
  if (
    conicSection.type !== state.attempt?.type ||
    !conicSection.center.isEqual ||
    !conicSection.foci.isSetEqual
  ) {
    return false
  }
  return conicSection.type === 'parabola' || conicSection.vertices.isSetEqual
}, 'checkConicSection')

export const solve = cache(async (state: State): Promise<State> => {
  const { conicSection } = await request(
    graphql(`
      query SolveConicSection($equation: Math!) {
        conicSection(equation: $equation) {
          type
          center {
            expr
          }
          vertices {
            list {
              expr
            }
          }
          foci {
            list {
              expr
            }
          }
        }
      }
    `),
    state,
  )
  return {
    ...state,
    attempt: {
      type: conicSection.type as 'parabola' | 'hyperbola' | 'ellipse',
      center: conicSection.center.expr,
      vertices: conicSection.vertices.list.map((v) => v.expr),
      foci: conicSection.foci.list.map((f) => f.expr),
    },
  }
}, 'solveConicSection')

type Params = {
  Types: ('hyperbola' | 'parabola' | 'ellipse')[]
  X0: string[]
  Y0: string[]
  A: string[]
  B: string[]
}

export async function generate(params: Params): Promise<State> {
  const s = sample([1, -1])
  const type = sample(params.Types)!
  const x0 = sample(params.X0)
  const y0 = sample(params.Y0)
  const a = sample(params.A)
  const b = sample(params.B)
  const equations = {
    ellipse: `(${b})^2 (x - ${x0})^2 + (${a})^2 (y - ${y0})^2 - (${a})^2 (${b})^2`,
    hyperbola: `${s} ( (${b})^2 (x - ${x0})^2 - (${a})^2 (y - ${y0})^2) - (${a})^2 (${b})^2`,
    parabola:
      s == 1 ? `(x - ${x0})^2 - 4 (${a}) (y - ${y0})` : `(y - ${y0})^2 - 4 (${a}) (x - ${x0})`,
  }
  const { expression } = await request(
    graphql(`
      query generateConicSection($expr: Math!) {
        expression(expr: $expr) {
          expand {
            expr
          }
        }
      }
    `),
    { expr: equations[type] },
  )
  return { equation: expression.expand.expr }
}

export default function ConicSection(props: ExerciseProps<State, Params>) {
  return (
    <ExerciseBase
      type="ConicSection"
      {...props}
      schema={schema}
      mark={mark}
      generate={generate}
      solve={solve}
      solution={<>
      <ul>
        <li>{props.feedback?.solution?.attempt?.type}</li>
        <li>Translatée de <Math value={props.feedback?.solution?.attempt?.center} /></li>
        <li>Sommets: <Math value={props.feedback?.solution?.attempt?.vertices.join(',')} /></li>
        </ul>
      </>}
    >
      <p>Caractérisez la conique suivante</p>
      <Math value={`${props.state?.equation} = 0`} displayMode />
      <div class="border rounded-xl my-4 p-4">
        <label class="block my-2">
          Type:
          <select
            class="bg-white border rounded p-2 ml-4"
            value={props.state?.attempt?.type}
            onChange={(e) => {
              props.setter('state', 'attempt', {
                type: e.target.value as 'parabola' | 'ellipse' | 'hyperbola',
                center: '',
                foci: [],
                vertices: [],
              })
            }}
          >
            <option value="parabola">Parabole</option>
            <option value="ellipse">Ellipse</option>
            <option value="hyperbola">Hyperbole</option>
          </select>
        </label>
        <Show when={props.state?.attempt?.type}>
          <label class="block my-2">
            {props.state?.attempt?.type === 'parabola' ? 'Sommet' : 'Centre'}:
            <Math
              class="border w-64 ml-4"
              editable={!props.options?.readOnly}
              value={
                props.state?.attempt?.center ||
                `\\left(\\placeholder[x]{}, \\placeholder[y]{}\\right)`
              }
              onBlur={(e) =>
                props.setter?.(
                  'state',
                  'attempt',
                  'center',
                  e.target.getValue('latex-without-placeholders'),
                )
              }
            />
          </label>
          <label class="block my-2">
            Foyer{props.state?.attempt?.type !== 'parabola' && ' 1'}:
            <Math
              class="border w-64 ml-4"
              editable={!props.options?.readOnly}
              value={
                props.state?.attempt?.foci[0] ||
                `\\left(\\placeholder[x]{}, \\placeholder[y]{}\\right)`
              }
              onBlur={(e) =>
                props.setter?.(
                  'state',
                  'attempt',
                  'foci',
                  0,
                  e.target.getValue('latex-without-placeholders'),
                )
              }
            />
          </label>
          <Show when={props.state?.attempt?.type !== 'parabola'}>
            <label class="block my-2">
              Foyer 2:
              <Math
                class="border w-64 ml-4"
                editable={!props.options?.readOnly}
                value={
                  props.state?.attempt?.foci[1] ||
                  `\\left(\\placeholder[x]{}, \\placeholder[y]{}\\right)`
                }
                onBlur={(e) =>
                  props.setter?.(
                    'state',
                    'attempt',
                    'foci',
                    1,
                    e.target.getValue('latex-without-placeholders'),
                  )
                }
              />
            </label>
            <label class="block my-2">
              Sommet 1:
              <Math
                class="border w-64 ml-4"
                editable={!props.options?.readOnly}
                value={
                  props.state?.attempt?.vertices[0] ||
                  `\\left(\\placeholder[x]{}, \\placeholder[y]{}\\right)`
                }
                onBlur={(e) =>
                  props.setter?.(
                    'state',
                    'attempt',
                    'vertices',
                    0,
                    e.target.getValue('latex-without-placeholders'),
                  )
                }
              />
            </label>
            <label class="block my-2">
              Sommet 2:
              <Math
                class="border w-64 ml-4"
                editable={!props.options?.readOnly}
                value={
                  props.state?.attempt?.vertices[1] ||
                  `\\left(\\placeholder[x]{}, \\placeholder[y]{}\\right)`
                }
                onBlur={(e) =>
                  props.setter?.(
                    'state',
                    'attempt',
                    'vertices',
                    1,
                    e.target.getValue('latex-without-placeholders'),
                  )
                }
              />
            </label>
          </Show>
        </Show>
      </div>
    </ExerciseBase>
  )
}
