import { chempyToLatex } from './Balance'
import z from 'zod'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

const { Component, schema } = createExerciseType({
  name: 'MolarMass',
  Component: (props) => (
    <>
      <p class="my-4">
        Quelle est la masse molaire de <Math value={chempyToLatex(props.question.substance)} />
      </p>
      <div class="flex justify-center items-center gap-2">
        <p>Réponse:</p>
        <Math name="attempt" value={props.attempt} editable displayMode />
        <Math value="\mathrm{g}/\mathrm{mol}" />
      </div>
    </>
  ),
  question: z.object({
    substance: z.string().nonempty(),
    error: z.number().default(0.01),
  }),
  attempt: z.string(),
  mark: async (question, attempt) => {
    'use server'
    const { chemistry } = await request(
      graphql(`
        query CalculateMass($substance: Formula!, $attempt: Math!, $error: Float!) {
          chemistry {
            substance(formula: $substance) {
              mass {
                isApproximatelyEqual(expr: $attempt, error: $error)
              }
            }
          }
        }
      `),
      { ...question, attempt },
    )
    return chemistry.substance.mass.isApproximatelyEqual
  },
})

export { Component as default, schema }
