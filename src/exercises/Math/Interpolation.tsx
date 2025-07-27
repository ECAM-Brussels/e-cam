import { random, sample, sampleSize } from 'lodash-es'
import { For, Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

const { Component, schema } = createExerciseType({
  name: 'Interpolation',
  Component: (props) => {
    const line = () => props.question.points.length === (props.question.line ? 1 : 2)
    return (
      <>
        <p>
          Trouvez l'équation {line() ? 'de la droite' : 'du polynôme'} passant par
          <For each={props.question.points}>
            {(coordinates, pos) => (
              <>
                <Math value={String.raw`\left(${coordinates.join(';')}\right)`} />
                {pos() === props.question.points.length - 2 && !props.question.line ? ' et' : ', '}
              </>
            )}
          </For>
          <Show when={props.question.line}>
            et {props.question.perpendicular ? 'perpendiculaire' : 'parallèle'} à la droite{' '}
            <Math value={props.question.line} />.
          </Show>
        </p>
        <div class="flex justify-center items-center gap-2">
          <Math name="attempt" editable value={props.attempt} />
        </div>
      </>
    )
  },
  question: z.object({
    points: z.tuple([z.string().nonempty(), z.string().nonempty()]).array().nonempty(),
    line: z.string().nonempty().optional(),
    perpendicular: z.boolean().default(false),
    x: z.string().default('x'),
    y: z.string().default('y'),
  }),
  attempt: z.string().nonempty(),
  mark: async (question, attempt) => {
    'use server'
    const { interpolate } = await request(
      graphql(`
        query CheckInterpolation(
          $points: [[Math!]!]!
          $attempt: Math!
          $line: Math
          $perpendicular: Boolean
        ) {
          interpolate(points: $points, line: $line, perpendicular: $perpendicular) {
            isEqual(expr: $attempt)
          }
        }
      `),
      { ...question, attempt },
    )
    return interpolate.isEqual
  },
  generator: {
    params: z.object({
      type: z.literal('line'),
      X: z.string().or(z.number().transform(String)).array().nonempty(),
      A: z.string().or(z.number().transform(String)).array().nonempty(),
      B: z.string().or(z.number().transform(String)).array().nonempty(),
      C: z.string().or(z.number().transform(String)).array().nonempty(),
      Vars: z
        .tuple([z.string(), z.string()])
        .array()
        .nonempty()
        .default([['x', 'y']]),
      line: z.number().min(0).max(1).default(0.5),
    }),
    generate: async (params) => {
      'use server'
      const a = sample(params.A)
      const b = sample(params.B)
      const [c, d] = sampleSize(params.C, 2)
      const [x, y] = sample(params.Vars)
      const [x1, x2] = sampleSize(params.X, 2)
      const eq = `(${a})(${x}) + (${b}) (${y}) = ${c}`
      const parallel = `(${a})(${x}) + (${b}) (${y}) = ${d}`
      const perpendicular = `(${b})(${x}) - (${a}) (${y}) = ${d}`
      const data = await request(
        graphql(`
          query GenerateLineInterpolation(
            $equation: Math!
            $parallel: Math!
            $perpendicular: Math!
            $x: Math!
            $x1: Math!
            $x2: Math!
            $y: Math!
          ) {
            y1: expression(expr: $equation) {
              subs(expr: $x, val: $x1) {
                solveset(x: $y) {
                  list {
                    expr
                  }
                }
              }
            }
            y2: expression(expr: $equation) {
              subs(expr: $x, val: $x2) {
                solveset(x: $y) {
                  list {
                    expr
                  }
                }
              }
            }
            parallel: expression(expr: $parallel) {
              simplify {
                expr
              }
            }
            perpendicular: expression(expr: $perpendicular) {
              simplify {
                expr
              }
            }
          }
        `),
        { equation: eq, x, y, x1, x2, parallel, perpendicular },
      )
      const line = random(0, 1, true) <= params.line
      const y1 = data.y1.subs.solveset.list[0].expr
      const y2 = data.y2.subs.solveset.list[0].expr
      if (line) {
        const perpendicular = random(0, 1, true) <= 0.5
        return {
          points: [[x1, y1]] as [[string, string]],
          line: perpendicular ? data.perpendicular.simplify.expr : data.parallel.simplify.expr,
          perpendicular,
        }
      } else {
        return {
          points: [
            [x1, y1],
            [x2, y2],
          ] as [[string, string], [string, string]],
        }
      }
    },
  },
})

export { Component as default, schema }
