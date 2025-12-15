import {
  buildExercise,
  buildSchema,
  buildStep,
  defineExercise,
  defineStep,
  type Schema,
} from './type'
import { MemoryRouter, Route } from '@solidjs/router'
import { render } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { Show } from 'solid-js'
import { test, expect } from 'vitest'
import z from 'zod/v4'

const schema = {
  name: 'test',
  question: z.object({ expr: z.string() }),
  steps: {
    start: z.object({ attempt: z.string() }),
    dummy: z.object({ attempt: z.string() }),
  },
} satisfies Schema

const start = defineStep(schema, 'start', {
  async feedback(question, state) {
    return { correct: question.expr === state.attempt, next: 'dummy', data: { hello: 'world' } }
  },
  View(props) {
    return (
      <>
        <p>
          <strong>Write</strong> exactly {props.question.expr}: <input name="attempt" />{' '}
        </p>
        <Show when={props.feedback}>
          {(feedback) => <p>{feedback().correct ? 'correct' : 'incorrect'}</p>}
        </Show>
      </>
    )
  },
})

const dummy = defineStep(schema, 'dummy', {
  async feedback(question, state) {
    return { correct: true, next: null, data: null }
  },
  View(props) {
    return <p>Dummy</p>
  },
})

const exercise = defineExercise({
  schema,
  steps: [start, dummy],
})

const user = userEvent.setup()

test('exercise schema is correct', async () => {
  const fullSchema = buildSchema(schema)
  let data = fullSchema.safeParse({
    question: {
      expr: 'x^2 - 5x + 6',
    },
  } satisfies z.infer<typeof fullSchema>)
  expect(data.success).toBe(true)
  data = fullSchema.safeParse({
    question: {
      expr: 'x^2 - 5x + 6',
    },
    attempt: [
      {
        name: 'start',
        state: { attempt: 'x^2 - 5x + 6' },
      },
    ],
  } satisfies z.infer<typeof fullSchema>)
  expect(data.success).toBe(true)
})

test('step displays properly', async () => {
  const Start = buildStep(start)
  const { findByText, getByRole } = render(
    () => (
      <MemoryRouter>
        <Route
          path="/"
          component={() => <Start question={{ expr: 'hello' }} context={{ readOnly: false }} />}
        />
      </MemoryRouter>
    ),
    { location: '/' },
  )
  expect(await findByText('Write')).toBeInTheDocument()
  const input = getByRole('textbox') as HTMLInputElement
  const submit = getByRole('button')
  expect(input).toBeInTheDocument()

  await user.type(input, 'hola')
  expect(input.value).toBe('hola')
  await user.click(submit)
  expect(await findByText('incorrect')).toBeInTheDocument()

  await user.clear(input)
  await user.type(input, 'hello')
  expect(input.value).toBe('hello')
  await user.click(submit)
  expect(await findByText('correct')).toBeInTheDocument()
})

test('exercise displays properly', async () => {
  const Exercise = buildExercise(exercise)
  const { findByText, getByRole } = render(
    () => (
      <MemoryRouter>
        <Route path="/" component={() => <Exercise question={{ expr: 'hello' }} />} />
      </MemoryRouter>
    ),
    { location: '/' },
  )
  expect(await findByText('Write')).toBeInTheDocument()
  const input = getByRole('textbox') as HTMLInputElement
  const submit = getByRole('button')
  expect(input).toBeInTheDocument()

  await user.type(input, 'hello')
  expect(input.value).toBe('hello')
  await user.click(submit)
  expect(await findByText('correct')).toBeInTheDocument()
  expect(await findByText('Dummy')).toBeInTheDocument()
})
