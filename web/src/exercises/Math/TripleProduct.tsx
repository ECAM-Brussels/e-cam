import { sample, sampleSize, shuffle } from 'lodash-es'
import { For, Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

function vec(A: string[], B: string[]): string[] {
  if (A.length !== B.length) throw new Error('Arrays should have the same length')
  return A.map((a, i) => `(${B[i]}) - (${a})`)
}

const { Component, schema } = createExerciseType({
  name: 'TripleProduct',
  Component: (props) => (
    <>
      <p>
        Calculez le volume du parallélépipède dont 4 des sommets sont
        <For each={props.question.points}>
          {(point, index) => (
            <>
              <Math value={`\\begin{pmatrix}${point.join(' \\\\ ')}\\end{pmatrix}`} />
              <Show when={index() < props.question.points.length - 2}>,</Show>
              <Show when={index() === props.question.points.length - 2}>
                <> et </>
              </Show>
            </>
          )}
        </For>
      </p>
      <div class="flex justify-center items-center gap-2">
        <Math value={`V =`} displayMode />
        <Math name="attempt" editable value={props.attempt} />
      </div>
    </>
  ),
  question: z.object({
    points: z.string().nonempty().array().length(3).array().length(4),
  }),
  attempt: z.string().nonempty(),
  mark: async (question, attempt) => {
    'use server'
    const { vector } = await request(
      graphql(`
        query CheckVolume($a: [Math!]!, $b: [Math!]!, $c: [Math!]!, $attempt: Math!) {
          vector(coordinates: $a) {
            cross(coordinates: $b) {
              dot(coordinates: $c) {
                abs {
                  isEqual(expr: $attempt)
                }
              }
            }
          }
        }
      `),
      {
        a: vec(question.points[0], question.points[1]),
        b: vec(question.points[0], question.points[2]),
        c: vec(question.points[0], question.points[3]),
        attempt,
      },
    )
    return vector.cross.dot.abs.isEqual
  },
  generator: {
    params: z.object({
      Components: z.number().transform(String).or(z.string().nonempty()).array().nonempty(),
      A: z.number().transform(String).or(z.string().nonempty()).array().nonempty(),
    }),
    generate: async (params) => {
      'use server'
      const points = [[sample(params.A), sample(params.A), sample(params.A)]]
      for (let i = 0; i < 3; i++) {
        points.push([
          `${points[0][0]} + ${sample(params.Components)}`,
          `${points[0][1]} + ${i > 0 ? sample(params.Components) : 0}`,
          `${points[0][2]} + ${i > 1 ? sample(params.Components) : 0}`,
        ])
      }
      const { B, C, D } = await request(
        graphql(`
          query CalculateVectorComponents(
            $B: [Math!]!
            $C: [Math!]!
            $D: [Math!]!
            $swaps: [[Int!]!]!
          ) {
            B: vector(coordinates: $B) {
              permute(swaps: $swaps) {
                expr {
                  simplify {
                    expr
                  }
                }
              }
            }
            C: vector(coordinates: $C) {
              permute(swaps: $swaps) {
                expr {
                  simplify {
                    expr
                  }
                }
              }
            }
            D: vector(coordinates: $D) {
              permute(swaps: $swaps) {
                expr {
                  simplify {
                    expr
                  }
                }
              }
            }
          }
        `),
        {
          B: points[1],
          C: points[2],
          D: points[3],
          swaps: [sampleSize([0, 1, 2], 2), sampleSize([0, 1, 2], 2)],
        },
      )
      return {
        points: shuffle([
          points[0],
          B.permute.expr.map((expr) => expr.simplify.expr),
          C.permute.expr.map((expr) => expr.simplify.expr),
          D.permute.expr.map((expr) => expr.simplify.expr),
        ]),
      }
    },
  },
})

export { Component as default, schema }
