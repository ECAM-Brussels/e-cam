import { product } from './Factor'
import { sample } from 'lodash-es'
import { createEffect, createSignal, For, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { z } from 'zod'
import Math from '~/components/Math'
import MathSet, { MathJSON } from '~/components/MathSet'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { narrow } from '~/lib/helpers'

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
        <Show when={props.question.S}>
          sur <MathSet value={props.question.S} />
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
    S: z.tuple([z.string()]).rest(z.any()).optional(),
    complex: z.boolean().default(false).describe('Solve over C or R'),
  }),
  attempt: z.union([z.string().nonempty().array(), z.string().transform((val) => [val])]),
  mark: async (question, attempt) => {
    'use server'
    const { equation } = await request(
      graphql(`
        query CheckEquationSolution(
          $equation: Math!
          $attempt: MathSet!
          $S: MathSet
          $complex: Boolean
        ) {
          equation: expression(expr: $equation) {
            solveset(S: $S, complex: $complex) {
              isSetEqual(S: $attempt)
            }
          }
        }
      `),
      { ...question, attempt: ['FiniteSet', ...attempt] },
    )
    return equation.solveset.isSetEqual
  },
  feedback: [
    async (remaining, question) => {
      'use server'
      if (!remaining) {
        const { equation } = await request(
          graphql(`
            query SolveEquation($equation: Math!, $S: MathSet, $complex: Boolean) {
              equation: expression(expr: $equation) {
                solveset(S: $S, complex: $complex) {
                  expr
                }
              }
            }
          `),
          question,
        )
        return { remaining, ...question, answer: equation.solveset.expr }
      }
      return { remaining }
    },
    (props) => (
      <Show
        when={narrow(
          () => props,
          (p) => 'answer' in p,
        )}
      >
        {(props) => (
          <p>
            L'ensemble des solutions est <Math value={props().answer} displayMode />
          </p>
        )}
      </Show>
    ),
  ],
  generator: {
    params: z.discriminatedUnion('type', [
      z.object({
        type: z.literal('simpleTrigonometric'),
        F: z
          .union([z.literal('cos'), z.literal('sin'), z.literal('tan'), z.literal('cot')])
          .array()
          .nonempty(),
        A: z.string().min(1).or(z.number()).array().nonempty(),
        B: z.string().min(1).or(z.number()).array().nonempty(),
        C: z.string().min(1).or(z.number()).array().nonempty(),
        X: z.string().array().nonempty().default(['x']),
        S: MathJSON.array()
          .nonempty()
          .default([['Interval', '0', '2 \\pi']]),
      }),
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
        X: z.string().array().nonempty().default(['x']),
        extra: z
          .string()
          .or(z.number())
          .array()
          .array()
          .transform((coeff) => product(...coeff)),
      }),
      z.object({
        type: z.literal('complexRoots'),
        N: z.number().array().nonempty(),
        R: z.string().nonempty().or(z.number().transform(String)).array().nonempty(),
        Theta: z.string().nonempty().array().nonempty(),
        Z: z.string().nonempty().array().nonempty().default(['z']),
      }),
    ]),
    generate: async (params) => {
      'use server'
      if (params.type === 'simpleTrigonometric') {
        const f = sample(params.F)
        const a = sample(params.A)
        const b = sample(params.B)
        const c = sample(params.C)
        const x = sample(params.X)
        const S = sample(params.S)
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
          { expr: `(${a}) ${x} + ${b}` },
        )
        const arg = expression.simplify.expr
        return {
          equation: `\\${f}\\left(${arg}\\right) = ${c}`,
          S,
          x,
        }
      } else if (params.type === 'polynomial') {
        const x = sample(params.X)
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
      } else if (params.type === 'complexRoots') {
        const [n, r, theta] = [sample(params.N), sample(params.R), sample(params.Theta)]
        const z = sample(params.Z)
        const { expression } = await request(
          graphql(`
            query CalculateComplexExpr($expr: Math!) {
              expression(expr: $expr) {
                expand {
                  simplify {
                    expr
                  }
                }
              }
            }
          `),
          { expr: `(${r})^{${n}} (\\cos((${n}) (${theta})) + i \\sin((${n}) (${theta})))` },
        )
        return {
          equation: `${z}^{${n}} = ${expression.expand.simplify.expr}`,
          complex: true,
          x: z,
        }
      } else {
        throw new Error('Type params has incorrect value')
      }
    },
  },
})

export { Component as default, schema }
