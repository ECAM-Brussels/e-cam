import { product } from './Factor'
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { sample } from 'lodash-es'
import { createEffect, For, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { z } from 'zod'
import Fa from '~/components/Fa'
import Math from '~/components/Math'
import MathSet, { MathJSON } from '~/components/MathSet'
import { graphql } from '~/gql'
import { createExerciseType, useExerciseContext } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { narrow } from '~/lib/helpers'
import { simplify } from '~/queries/algebra'

const { Component, schema, mark, getFeedback, attempt } = createExerciseType({
  name: 'Equation',
  Component: (props) => {
    const [attempt, setAttempt] = createStore<string[]>([])
    const exercise = useExerciseContext()
    createEffect(() => setAttempt(props.attempt ?? ['']))
    return (
      <>
        <p>Résolvez l'équation</p>
        <Math value={props.question.equation} displayMode />
        <Show when={props.question.S}>
          sur <MathSet value={props.question.S} />.
        </Show>
        <div class="flex flex-wrap gap-8">
          <For each={attempt}>
            {(sol, i) => (
              <label class="flex gap-2 items-center">
                <Math value={`${props.question.x} =`} />
                <Math editable value={sol} name="attempt" />
                <Show when={!exercise?.readOnly}>
                  <button
                    class="text-slate-200"
                    type="button"
                    onClick={() => setAttempt(attempt.filter((_, j) => j !== i()))}
                  >
                    <Fa icon={faTrashCan} />
                  </button>
                </Show>
              </label>
            )}
          </For>
          <Show when={!exercise?.readOnly}>
            <button
              class="text-sky-800 px-3 py-0"
              type="button"
              onClick={() => setAttempt(attempt.length, '')}
            >
              <Fa icon={faPlus} /> <span class="text-sm">Ajouter une solution</span>
            </button>
          </Show>
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
          $x: Math!
          $attempt: MathSet!
          $S: MathSet
          $complex: Boolean
        ) {
          equation: expression(expr: $equation) {
            solveset(S: $S, x: $x, complex: $complex) {
              isSetEqual(S: $attempt, complex: $complex)
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
            query SolveEquation($equation: Math!, $x: Math!, $S: MathSet, $complex: Boolean) {
              equation: expression(expr: $equation) {
                solveset(S: $S, x: $x, complex: $complex) {
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
      z.object({
        type: z.literal('withParams'),
        questions: z
          .union([
            z
              .string()
              .transform((equation) => ({ equation, x: 'x', complex: false, S: undefined })),
            z.object({
              x: z.string().default('x').describe('Unknown value to solve for'),
              equation: z.string().describe('Equation'),
              S: z.tuple([z.string()]).rest(z.any()).optional(),
              complex: z.boolean().default(false).describe('Solve over C or R'),
            }),
          ])
          .array()
          .nonempty(),
        subs: z.record(
          z.string().nonempty(),
          z.string().nonempty().or(z.number().transform(String)).array().nonempty(),
        ),
        simplify: z.boolean().default(true),
      }),
    ]),
    generate: async (params) => {
      'use server'
      if (params.type === 'simpleTrigonometric') {
        // f(ax + b) = f(c)
        const f = sample(params.F)
        const a = sample(params.A)
        const b = sample(params.B)
        const c = sample(params.C)
        const x = sample(params.X)
        const S = sample(params.S)
        const { lhs, rhs } = await request(
          graphql(`
            query CalculateSides($lhs: Math!, $rhs: Math!) {
              lhs: expression(expr: $lhs) {
                simplify {
                  expr
                }
              }
              rhs: expression(expr: $rhs) {
                simplify {
                  expr
                  isFinite
                }
              }
            }
          `),
          { lhs: `(${a}) ${x} + ${b}`, rhs: `\\${f}(${c})` },
        )
        const finalRhs = rhs.simplify.isFinite ? rhs.simplify.expr : '0'
        return {
          equation: `\\${f}\\left(${lhs.simplify.expr}\\right) = ${finalRhs}`,
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
      } else if (params.type === 'withParams') {
        const question = sample(params.questions)
        Object.entries(params.subs).forEach(([symbol, choices]) => {
          question.equation = question.equation.replaceAll(`{${symbol}}`, `{${sample(choices)}}`)
        })
        if (params.simplify) {
          question.equation = await simplify(question.equation)
        }
        return question
      } else {
        throw new Error('Type params has incorrect value')
      }
    },
  },
})

export { Component as default, schema, mark, getFeedback, attempt }
