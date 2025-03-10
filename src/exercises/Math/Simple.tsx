import { z } from 'zod'
import Markdown from '~/components/Markdown'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { decrypt, encrypt } from '~/lib/cryptography'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

const { Component, schema, mark } = createExerciseType({
  name: 'Simple',
  schema: z
    .object({
      question: z.string(),
      answer: z.string(),
      encrypted: z.boolean().default(false),
      attempt: z.string().default(''),
    })
    .transform((state) => {
      if (!state.encrypted) {
        state.answer = encrypt(state.answer, import.meta.env.VITE_PASSPHRASE)
        state.encrypted = true
      }
      return state
    }),
  mark: async (state) => {
    'use server'
    const { attempt } = await request(
      graphql(`
        query CheckSimple($answer: Math!, $attempt: Math!) {
          attempt: expression(expr: $attempt) {
            isEqual(expr: $answer)
          }
        }
      `),
      { ...state, answer: decrypt(state.answer, import.meta.env.VITE_PASSPHRASE) },
    )
    return attempt.isEqual
  },
  Component: (props) => (
    <>
      <Markdown value={props.question} />
      <label class="inline-flex items-center gap-2">
        Réponse:
        <Math name="attempt" class="border w-64" value={props.attempt} editable />
      </label>
    </>
  ),
  solve: async (state) => {
    'use server'
    return { answer: decrypt(state.answer, import.meta.env.VITE_PASSPHRASE) }
  },
  Solution: (props) => (
    <p>
      La réponse est <Math value={props.answer} />.
    </p>
  ),
})

export { Component as default, schema, mark }
