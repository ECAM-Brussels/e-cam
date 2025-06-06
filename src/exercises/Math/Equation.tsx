import { product } from './Factor'
import { sample } from 'lodash-es'
import { createEffect, createSignal, For, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

const { Component, schema } = createExerciseType({
  name: 'Equation',
  Component: (props) => {
    const [attempt, setAttempt] = createStore<string[]>([])
    const [focused, setFocused] = createSignal(false)
    createEffect(() => setAttempt(props.attempt ?? []))
    return (
      <>
        <p>Résolvez l'équation</p>
        <Math value={props.question.equation} displayMode />
        <Show when={props.question.interval}>
          {(interval) => (
            <p>
              sur l'intervalle <Math value={`\\left[${interval().join(',')}\\right]`} />.
            </p>
          )}
        </Show>
        <div class="flex gap-8">
          <For each={attempt}>
            {(sol, i) => (
              <label
                class="flex gap-2 items-center"
                onMouseLeave={() => {
                  if (!sol && !focused()) {
                    setAttempt(attempt.filter((_, j) => j !== i()))
                  }
                }}
              >
                <Math value={`${props.question.x} =`} />
                <Math
                  editable
                  value={sol}
                  name="attempt"
                  onfocus={() => setFocused(true)}
                  onBlur={(e) => {
                    setFocused(false)
                    setAttempt(i(), e.target.value)
                    if (!e.target.value) {
                      setAttempt(attempt.filter((_, j) => j !== i()))
                    }
                  }}
                />
              </label>
            )}
          </For>
          <label
            class="inline-flex gap-2 items-center opacity-25 hover:opacity-100"
            onMouseEnter={() => {
              if (!focused()) {
                setAttempt(attempt.length, '')
              }
            }}
          >
            <Math value={`${props.question.x} =`} />
            <Math class="border min-w-24 p-2" editable />
          </label>
        </div>
      </>
    )
  },
  question: z.object({
    x: z.string().default('x').describe('Unknown value to solve for'),
    equation: z.string().describe('Equation'),
    interval: z.tuple([z.string(), z.string()]).optional(),
    complex: z.boolean().default(false).describe('Solve over C or R'),
  }),
  attempt: z.union([z.string().min(1).array(), z.string().transform((val) => [val])]),
  mark: async (question, attempt) => {
    'use server'
    const { interval, ...info } = question
    const { equation } = await request(
      graphql(`
        query CheckEquationSolution(
          $equation: Math!
          $attempt: [Math!]!
          $a: Math
          $b: Math
          $x: Math
          $complex: Boolean
        ) {
          equation: expression(expr: $equation) {
            solveset(a: $a, b: $b, x: $x, complex: $complex) {
              isSetEqual(items: $attempt)
            }
          }
        }
      `),
      { ...info, a: interval?.[0], b: interval?.[1], attempt },
    )
    return equation.solveset.isSetEqual
  },
  generator: {
    params: z.discriminatedUnion('type', [
      z.object({
        type: z.literal('polynomial'),
        A: z.number().or(z.string()).array().default([1]),
        roots: z.union([
          z.string().or(z.number()).array().array(),
          z
            .object({
              product: z.string().or(z.number()).array().array(),
            })
            .transform((set) => product(...set.product)),
        ]),
        X: z.string().array().default(['x']),
        extra: z
          .string()
          .or(z.number())
          .array()
          .array()
          .transform((coeff) => product(...coeff)),
      }),
    ]),
    generate: async (params) => {
      const x = sample(params.X)!
      let [lhs, rhs] = [`(${sample(params.A)})`, '']
      sample(params.roots)?.forEach((root) => {
        lhs += `((${x}) - (${root}))`
      })
      sample(params.extra)?.forEach((coeff, index) => {
        rhs += `+ (${coeff})` + (index > 0 ? `(${x})^{${index}}` : '')
      })
      const data = await request(
        graphql(`
          query CalculateQuadraticEquation($lhs: Math!, $rhs: Math!) {
            lhs: expression(expr: $lhs) {
              normalizeRoots {
                add(expr: $rhs) {
                  simplify {
                    expr
                  }
                }
              }
            }
            rhs: expression(expr: $rhs) {
              simplify {
                expr
              }
            }
          }
        `),
        { lhs, rhs },
      )
      return {
        equation: `${data.lhs.normalizeRoots.add.simplify.expr} = ${data.rhs.simplify.expr}`,
        x,
      }
    },
  },
})

export { Component as default, schema }
