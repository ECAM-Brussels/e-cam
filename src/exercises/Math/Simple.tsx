import { Show } from 'solid-js'
import { z } from 'zod'
import Markdown from '~/components/Markdown'
import Math from '~/components/Math'
import { graphql } from '~/gql'
import { decrypt, encrypt } from '~/lib/cryptography'
import { createExerciseType } from '~/lib/exercises/base'
import { request } from '~/lib/graphql'

const { Component, schema, mark } = createExerciseType({
  name: 'Simple',
  Component: (props) => (
    <>
      <Markdown value={props.question} />
      <label class="inline-flex items-center gap-2 mt-4">
        Réponse:
        <Math name="attempt" class="border p-2 min-w-24" value={props.attempt} editable />
      </label>
    </>
  ),
  state: z
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
  feedback: [
    async (state, remainingAttempts) => {
      'use server'
      if (!remainingAttempts) {
        return { answer: decrypt(state.answer, import.meta.env.VITE_PASSPHRASE) }
      }
      return {}
    },
    (props) => (
      <Show when={props.answer}>
        <p>
          La réponse est <Math value={props.answer} />.
        </p>
      </Show>
    ),
  ],
})

export { Component as default, schema, mark }
