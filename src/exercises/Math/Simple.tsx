import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { For, Show } from 'solid-js'
import { z } from 'zod'
import Fa from '~/components/Fa'
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
    .or(z.number().transform(String))
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
            <Math name="attempt" value={props.attempt?.[index()]} editable />
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
    .transform(async (state) => {
      if ('answer' in state) {
        const { encrypted, ...part } = state
        state = {
          encrypted,
          parts: [part],
        }
      }
      if (!state.encrypted) {
        state.parts = await Promise.all(
          state.parts.map(async (q) => ({
            ...q,
            answer: await encrypt(q.answer),
          })),
        )
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
  mark: async (question, attempt) => {
    'use server'
    const parts = await Promise.all(
      question.parts.map(async (q, i) =>
        attempt.length ? checkEqual(attempt[i], await decrypt(q.answer)) : false,
      ),
    )
    return parts.every((t) => t)
  },
  feedback: [
    async (remaining, question, attempt) => {
      'use server'
      if (!remaining) {
        return {
          question,
          attempt,
          answers: await Promise.all(
            question.parts.map(async (q) => ({
              ...q,
              answer: await decrypt(q.answer),
            })),
          ),
        }
      } else {
        const feedback = await Promise.all(
          question.parts.map(async (q, i) =>
            attempt.length ? checkEqual(attempt[i], await decrypt(q.answer)) : false,
          ),
        )
        return {
          question,
          attempt,
          feedback,
        }
      }
    },
    (props) => (
      <>
        <Show when={props.feedback}>
          <ul class="list-disc px-8">
            <For each={props.feedback}>
              {(part, i) => (
                <li>
                  <div
                    class="flex items-center gap-2"
                    classList={{ 'text-green-800': part, 'text-red-800': !part }}
                  >
                    <Math value={props.attempt[i()]} />
                    <Markdown value={props.question.parts[i()].unit} />
                    <Fa icon={part ? faCheck : faXmark} />
                  </div>
                </li>
              )}
            </For>
          </ul>
        </Show>
        <Show when={props.answers}>
          <p>La réponses sont:</p>
          <ul class="list-disc px-8">
            <For each={props.answers}>
              {(part) => (
                <li>
                  <div class="flex items-center gap-2">
                    <Math value={part.answer} />
                    <Markdown value={part.unit} />
                  </div>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </>
    ),
  ],
})

export { Component as default, schema, mark }
