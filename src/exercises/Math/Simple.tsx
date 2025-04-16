import { For, Show } from 'solid-js'
import { z } from 'zod'
import Markdown from '~/components/Markdown'
import Math from '~/components/Math'
import { decrypt, encrypt } from '~/lib/cryptography'
import { createExerciseType } from '~/lib/exercises/base'
import { checkEqual } from '~/queries/algebra'

const part = z.object({
  text: z.string(),
  answer: z.string(),
  label: z.string().default(''),
  unit: z.string().default(''),
})

const { Component, schema, mark } = createExerciseType({
  name: 'Simple',
  Component: (props) => (
    <For each={props.parts}>
      {(part, index) => (
        <>
          <Markdown value={part.text} />
          <div class="flex items-center gap-2 my-4">
            <Markdown value={part.label} />
            <Math
              name="attempts"
              class="border p-2 min-w-24"
              value={props.attempts?.[index()]}
              editable
            />
            <Markdown value={part.unit} />
          </div>
        </>
      )}
    </For>
  ),
  state: z
    .object({
      parts: part.array(),
      attempts: z.string().min(1).array().optional(),
      encrypted: z.boolean().default(false),
    })
    .transform((state) => {
      if (!state.encrypted) {
        state.parts = state.parts.map((q) => ({
          ...q,
          answer: encrypt(q.answer, import.meta.env.VITE_PASSPHRASE),
          attempt: '',
        }))
        state.encrypted = true
      }
      return state
    }),
  mark: (state) => {
    'use server'
    const parts = state.parts.map((q, i) =>
      state.attempts?.length
        ? checkEqual(state.attempts[i], decrypt(q.answer, import.meta.env.VITE_PASSPHRASE))
        : false,
    )
    return Promise.race([
      Promise.all(parts).then((t) => t.every((v) => v)),
      Promise.race(parts.map(async (t) => ((await t) ? new Promise<never>(() => {}) : false))),
    ])
  },
  feedback: [
    async (state, remainingAttempts) => {
      'use server'
      if (!remainingAttempts) {
        return {
          parts: state.parts.map((q) => ({
            ...q,
            answer: decrypt(q.answer, import.meta.env.VITE_PASSPHRASE),
          })),
        }
      }
      return {}
    },
    (props) => (
      <Show when={props.parts}>
        <p>La réponses sont:</p>
        <ul>
          <For each={props.parts}>
            {(part) => (
              <li class="flex items-center">
                <Math value={part.answer} />
                <Markdown value={part.unit} />
              </li>
            )}
          </For>
        </ul>
      </Show>
    ),
  ],
})

export { Component as default, schema, mark }
