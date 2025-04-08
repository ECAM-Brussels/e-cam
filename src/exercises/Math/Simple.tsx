import { Show } from 'solid-js'
import { z } from 'zod'
import Markdown from '~/components/Markdown'
import Math from '~/components/Math'
import { decrypt, encrypt } from '~/lib/cryptography'
import { createExerciseType } from '~/lib/exercises/base'
import { checkEqual } from '~/queries/algebra'

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
      attempt: z.undefined().or(z.string().min(1)),
    })
    .transform((state) => {
      if (!state.encrypted) {
        state.answer = encrypt(state.answer, import.meta.env.VITE_PASSPHRASE)
        state.encrypted = true
      }
      return { attempt: '', ...state }
    }),
  mark: (state) => {
    'use server'
    return checkEqual(state.attempt, decrypt(state.answer, import.meta.env.VITE_PASSPHRASE))
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
