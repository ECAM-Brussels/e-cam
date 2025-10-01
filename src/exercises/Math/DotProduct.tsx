import { random, sample } from 'lodash-es'
import { Show } from 'solid-js'
import { z } from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'
import { narrow } from '~/lib/helpers'
import { checkEqual, simplify } from '~/queries/algebra'

const vector = (v: string[]) => `\\begin{pmatrix}${v.join(` \\\\ `)}\\end{pmatrix}`

const { Component, schema } = createExerciseType({
  name: 'DotProduct',
  Component: (props) => (
    <Show
      when={narrow(
        () => props.question,
        (question) => 'theta' in question,
      )}
      fallback={
        <>
          <p>Calculez le produit scalaire suivant :</p>
          <div class="flex justify-center items-center gap-2">
            <Show
              when={narrow(
                () => props.question,
                (question) => 'a' in question,
              )}
            >
              {(question) => (
                <Math
                  value={`${vector(question().a)} \\cdot ${vector(question().b)} =`}
                  displayMode
                />
              )}
            </Show>
            <Math name="attempt" value={props.attempt} editable displayMode />
          </div>
        </>
      }
    >
      {(question) => (
        <>
          <p>
            Calculez le produit scalaire <Math value="\vec u \cdot \vec v" /> sachant que{' '}
            <Math value={`\\| \\vec u \\| = ${question().norms[0]}`} />,{' '}
            <Math value={`\\| \\vec v \\| = ${question().norms[1]}`} />, et que l'angle entre ces
            deux vecteurs est <Math value={question().theta} />{' '}
            {question().unit === 'degrees' && 'degrés'}
            {'.'}
          </p>
          <div class="flex justify-center items-center gap-2">
            <Math value="\vec u \cdot \vec v = " displayMode />
            <Math name="attempt" value={props.attempt} editable displayMode />
          </div>
        </>
      )}
    </Show>
  ),
  question: z
    .object({
      a: z.string().nonempty().or(z.number().transform(String)).array().nonempty(),
      b: z.string().nonempty().or(z.number().transform(String)).array().nonempty(),
    })
    .or(
      z.object({
        norms: z.tuple([z.string().nonempty(), z.string().nonempty()]),
        theta: z.string().nonempty(),
        unit: z.literal('degrees').or(z.literal('radians')).default('radians'),
      }),
    ),
  attempt: z.string().nonempty(),
  mark: async (question, attempt) => {
    'use server'
    if ('a' in question) {
      const { vector } = await request(
        graphql(`
          query CheckDotProduct($a: [Math!]!, $b: [Math!]!, $attempt: Math!) {
            vector(coordinates: $a) {
              dot(coordinates: $b) {
                isEqual(expr: $attempt)
              }
            }
          }
        `),
        { ...question, attempt },
      )
      return vector.dot.isEqual
    } else {
      const angle = `(${question.theta}) \\cdot ${question.unit === 'radians' ? 1 : '\\frac{\\pi}{180}'}`
      return await checkEqual(
        attempt,
        `(${question.norms[0]}) (${question.norms[1]}) \\cos(${angle})`,
      )
    }
  },
  feedback: [
    async (remaining, question) => {
      'use server'
      if (!remaining) {
        if ('a' in question) {
          const { vector } = await request(
            graphql(`
              query CalculateDotProduct($a: [Math!]!, $b: [Math!]!) {
                vector(coordinates: $a) {
                  dot(coordinates: $b) {
                    expr
                  }
                }
              }
            `),
            question,
          )
          return { remaining, cartesian: true, ...question, answer: vector.dot.expr }
        } else {
          const angle = `(${question.theta}) \\cdot ${question.unit === 'radians' ? 1 : '\\frac{\\pi}{180}'}`
          return {
            remaining,
            ...question,
            answer: await simplify(`(${question.norms[0]}) (${question.norms[1]}) \\cos(${angle})`),
          }
        }
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
        {(p) => (
          <Show
            when={narrow(
              () => p(),
              (p) => 'cartesian' in p,
            )}
            fallback={<Math value={`\\vec u \\cdot \\vec v = ${p().answer}`} displayMode />}
          >
            {(p) => (
              <Math
                value={`${vector(p().a)} \\cdot ${vector(p().b)} = ${p().answer}`}
                displayMode
              />
            )}
          </Show>
        )}
      </Show>
    ),
  ],
  generator: {
    params: z
      .object({
        numbers: z.string().nonempty().or(z.number().transform(String)).array().nonempty(),
      })
      .or(
        z.object({
          Norms: z.string().nonempty().or(z.number().transform(String)).array().nonempty(),
          Theta: z.string().nonempty().or(z.number().transform(String)).array().nonempty(),
          degreesProbability: z.number().min(0).max(1).default(0.5),
        }),
      ),
    generate: async (params) => {
      'use server'
      if ('numbers' in params) {
        return {
          a: [sample(params.numbers), sample(params.numbers), sample(params.numbers)] as [
            string,
            ...string[],
          ],
          b: [sample(params.numbers), sample(params.numbers), sample(params.numbers)] as [
            string,
            ...string[],
          ],
        }
      } else {
        const unit = random(0, 1, true) <= params.degreesProbability ? 'degrees' : 'radians'
        const theta = sample(params.Theta)
        return {
          norms: [sample(params.Norms), sample(params.Norms)] as [string, string],
          unit: unit as 'degrees' | 'radians',
          theta: unit === 'degrees' ? await simplify(`\\frac{(${theta}) \\pi} {180}`) : theta,
        }
      }
    },
  },
})

export { Component as default, schema }
