import { For, Show } from 'solid-js'
import { z } from 'zod'
import Markdown from '~/components/Markdown'
import Math from '~/components/Math'
import { decrypt, encrypt } from '~/lib/cryptography'
import { createExerciseType } from '~/lib/exercises/base'
import { checkEqual } from '~/queries/algebra'

const base = z.object({ encrypted: z.boolean().default(false) })

const part = {
  text: z.string().describe('Text of the question or part, written in markdown'),
  answer: z
    .string()
    .describe('Answer as a LaTeX string, will automatically be encrypted before reaching the user'),
  label: z
    .string()
    .default('')
    .describe('Text right before the answer prompt, written in markdown'),
  unit: z.string().default('').describe('Text right after the answer prompt, written in markdown'),
}

const { Component, schema, mark } = createExerciseType({
  name: 'Simple',
  Component: (props) => (
    <For each={props.question.parts}>
      {(part, index) => (
        <>
          <Markdown value={part.text} />
          <div class="flex items-center gap-2 my-4">
            <Markdown value={part.label} />
            <Math
              name="attempts"
              class="border p-2 min-w-24"
              value={props.attempt[index()]}
              editable
            />
            <Markdown value={part.unit} />
          </div>
        </>
      )}
    </For>
  ),
  question: z
    .union([
      base.extend(part),
      base.extend({
        parts: z
          .object(part)
          .array()
          .default([])
          .describe('List of question parts, with their own prompts, texts and answers.'),
      }),
    ])
    .transform((state) => {
      if ('answer' in state) {
        const { encrypted, ...part } = state
        state = {
          encrypted,
          parts: [part],
        }
      }
      if (!state.encrypted) {
        state.parts = state.parts.map((q) => ({
          ...q,
          answer: encrypt(q.answer, import.meta.env.VITE_PASSPHRASE),
        }))
        state.encrypted = true
      }
      return state
    }),
  attempt: z
    .string()
    .min(1)
    .array()
    .or(z.string().transform((s) => [s]))
    .default([]),
  mark: (question, attempt) => {
    'use server'
    const parts = question.parts.map((q, i) =>
      attempt.length
        ? checkEqual(attempt[i], decrypt(q.answer, import.meta.env.VITE_PASSPHRASE))
        : false,
    )
    return Promise.race([
      Promise.all(parts).then((t) => t.every((v) => v)),
      Promise.race(parts.map(async (t) => ((await t) ? new Promise<never>(() => {}) : false))),
    ])
  },
  feedback: [
    async (remaining, question) => {
      'use server'
      if (!remaining) {
        return {
          parts: question.parts.map((q) => ({
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
