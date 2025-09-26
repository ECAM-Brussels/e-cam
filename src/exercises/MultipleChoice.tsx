import { For, Show } from 'solid-js'
import { z } from 'zod'
import Markdown from '~/components/Markdown'
import { decrypt, encrypt } from '~/lib/cryptography'
import { createExerciseType } from '~/lib/exercises/base'

const { Component, schema } = createExerciseType({
  name: 'MultipleChoice',
  Component: (props) => (
    <>
      <Markdown value={props.question.text} />
      <div class="flex gap-4 my-4">
        <For each={props.question.choices}>
          {(choice) => (
            <button type="button">
              <label class="border rounded-xl bg-white shadow cursor-pointer px-4 py-2 flex gap-4 items-center">
                <input
                  type="radio"
                  name="attempt"
                  value={choice}
                  checked={props.attempt === choice}
                />{' '}
                <Markdown value={choice} />
              </label>
            </button>
          )}
        </For>
      </div>
    </>
  ),
  question: z
    .object({
      text: z.string().describe('Question, entered as markdown'),
      choices: z.string().array().describe('Choices offered to the students'),
      answer: z.string().describe('Correct answer, should be part of the choices'),
      encrypted: z.boolean().default(false).describe("Whether the answer's been encrypted"),
    })
    .transform(async (question) => {
      const { encrypted, answer, ...info } = question
      if (!encrypted) {
        return {
          encrypted: true,
          ...info,
          answer: await encrypt(answer),
        }
      }
      return question
    }),
  attempt: z.string().min(1),
  mark: async (question, attempt) => {
    'use server'
    return attempt === (await decrypt(question.answer))
  },
  feedback: [
    async (remaining, question) => {
      'use server'
      if (!remaining) {
        return { answer: await decrypt(question.answer) }
      }
      return {}
    },
    (props) => (
      <Show when={props.answer}>
        {(answer) => (
          <p>
            La réponse correcte est: <Markdown value={answer()} />
          </p>
        )}
      </Show>
    ),
  ],
})

export { Component as default, schema }
