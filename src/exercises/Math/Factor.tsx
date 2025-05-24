import { sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { checkFactorisation, expand, normalizePolynomial } from '~/queries/algebra'

export function product<T>(...allEntries: T[][]): T[][] {
  return allEntries.reduce<T[][]>(
    (results, entries) =>
      results
        .map((result) => entries.map((entry) => result.concat([entry])))
        .reduce((subResults, result) => subResults.concat(result), []),
    [[]],
  )
}

const math = z.number().or(z.string())

const { Component, schema } = createExerciseType({
  name: 'Factor',
  Component: (props) => (
    <>
      <p class="my-4">Factorisez au maximum l'expression suivante.</p>
      <div class="flex justify-center items-center gap-2">
        <Math value={`${props.question.expr}=`} />
        <Math name="attempt" class="border min-w-24 p-2" editable value={props.attempt} />
      </div>
    </>
  ),
  question: z
    .object({
      expr: z.string().describe('Expression to factorise'),
      x: z.string().default('x'),
      expand: z
        .boolean()
        .describe('Whether to expand expr before it is seen by the user')
        .default(false),
    })
    .transform(async (state) => {
      if (state.expand) {
        state = { ...state, expr: await expand(state.expr), expand: false }
      }
      return state as typeof state & { expand: false }
    }),
  attempt: z.string().min(1),
  mark: (question, attempt) => checkFactorisation(attempt, question.expr),
  feedback: [
    async (remaining, question, attempt) => {
      const data = await request(
        graphql(`
          query FactorisationFeedback($expr: Math!, $x: Math!, $attempt: Math!) {
            attempt: expression(expr: $attempt) {
              solveset {
                list {
                  expr
                  opposite {
                    subsIn(expr: $expr, var: $x) {
                      isEqual(expr: "0")
                    }
                  }
                  subsIn(expr: $expr, var: $x) {
                    isEqual(expr: "0")
                  }
                }
              }
            }
            expr: expression(expr: $expr) {
              factor {
                expr
              }
              solveset {
                list(sort: abs) {
                  expr
                  opposite {
                    add(expr: $x) {
                      expr
                    }
                  }
                }
              }
            }
          }
        `),
        { attempt: attempt, expr: question.expr, x: question.x },
      )
      const studentRoots = data.attempt.solveset.list.map((info) => ({
        root: info.expr,
        opposite: info.opposite.subsIn.isEqual === true,
        correct: info.subsIn.isEqual === true,
      }))
      return {
        remaining,
        answer: data.expr.factor.expr,
        factors: data.expr.solveset.list.map((root) => root.opposite.add.expr),
        firstCorrectRoot: data.expr.solveset.list[0].expr,
        correctRoots: studentRoots.filter((r) => r.correct),
        wrongSign: studentRoots.filter((r) => r.opposite),
        incorrectRoots: studentRoots.filter((r) => !r.correct),
        question,
      }
    },
    (props) => (
      <Show
        when={props.remaining}
        fallback={
          <div>
            <p>
              On commence par trouver la racine{' '}
              <Math value={`${props.question.x} = ${props.firstCorrectRoot}`} /> par essais et
              erreurs, donc <Math value={props.factors[0]} /> est un facteur.
            </p>
            <p>
              Via la distributivité, on atteint la réponse finale <Math value={props.answer} />.
            </p>
          </div>
        }
      >
        <Show when={props.correctRoots.length === 0}>
          <Show
            when={props.wrongSign.length}
            fallback={<p>Est-ce que tu peux trouver une racine à vue?</p>}
          >
            <p>Vérifie le signe de tes racines.</p>
          </Show>
          <p>
            Rappelle-toi que si <Math value={`${props.question.x} = a`} /> est une racine, alors{' '}
            <Math value={`${props.question.x} - a`} /> est un facteur.
          </p>
        </Show>
        <Show when={props.correctRoots.length === 1 && props.incorrectRoots}>
          <p>
            La racine <Math value={`${props.question.x} = ${props.correctRoots[0].root}`} /> est
            correcte. Peux-tu vérifier ta distributivité?
          </p>
        </Show>
      </Show>
    ),
  ],
  generator: {
    params: z.object({
      A: z
        .number()
        .array()
        .default([1])
        .describe('Possibilities for the constant factor in the factorisation'),
      X: z.string().array().default(['x']),
      roots: z
        .union([
          math.array().array(),
          z
            .object({
              product: math
                .array()
                .array()
                .describe(
                  'Generate a list of tuples by taking the cartesian products of the supplied lists',
                ),
            })
            .transform((set) => product(...set.product)),
        ])
        .describe(
          'Possibilities for the roots, either entered as tuples, or a Cartesian product with `product`',
        ),
    }),
    generate: async (params) => {
      'use server'
      let expr = `(${sample(params.A)})`
      sample(params.roots)?.forEach((root) => {
        expr += `(x - (${root}))`
      })
      return { expr: await normalizePolynomial(expr) }
    },
  },
})

export { Component as default, schema }
