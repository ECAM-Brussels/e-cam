import { createExerciseType } from './base'
import { optionsSchema } from './schemas'
import { createMemoryHistory, MemoryRouter, Route } from '@solidjs/router'
import { render, waitFor } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { z } from 'zod'

const { Component } = createExerciseType({
  name: 'Test',
  question: z.object({
    expr: z.string().nonempty(),
  }),
  attempt: z.string().nonempty(),
  mark: (question, attempt) => question.expr === attempt,
  Component: (props) => (
    <>
      <p>Copy the expression {props.question.expr} exactly as is</p>
      <label>
        Your attempt:
        <input name="attempt" value={props.attempt} required />
      </label>
    </>
  ),
  generator: {
    params: z.object({
      words: z.string().array(),
    }),
    generate: (params) => {
      return { expr: params.words[0] }
    },
  },
})

const user = userEvent.setup()
const eventHandler = vi.fn((event: any) => {
  console.log(event)
})
const history = createMemoryHistory()
history.set({ value: '/' })

test('exercise type creation works', async () => {
  const results = render(() => (
    <MemoryRouter history={history}>
      <Route
        path="/"
        component={() => (
          <Component
            type="Test"
            options={optionsSchema.parse({})}
            attempts={[]}
            question={{ expr: 'hello' }}
            onChange={eventHandler}
          />
        )}
      />
    </MemoryRouter>
  ))
  const input = (await results.findByLabelText('Your attempt:')) as HTMLInputElement
  const button = await results.findByRole('button')
  expect(input).not.toBeFalsy()
  await user.type(input, 'world')
  expect(input.value).toBe('world')
  await user.click(button)
  expect(eventHandler).toHaveBeenCalledWith({
    state: { expr: 'hello', attempt: 'world' },
    feedback: { correct: false, solution: { expr: 'hello', attempt: 'hello' } },
  })
  await user.clear(input)
  await user.type(input, 'hello')
  expect(input.value).toBe('hello')
  await user.click(button)
  expect(eventHandler).toHaveBeenCalledWith({
    state: { expr: 'hello', attempt: 'hello' },
    feedback: { correct: true, solution: { expr: 'hello', attempt: 'hello' } },
  })
})

test('triggers generator', async () => {
  const results = render(() => (
    <MemoryRouter history={history}>
      <Route
        path="/"
        component={() => (
          <Component params={{ words: ['hola', 'hello', 'ciao'] }} onChange={eventHandler} />
        )}
      />
    </MemoryRouter>
  ))

  const text = results.findByText(/generating/i)
  expect(text).toBeTruthy()

  waitFor(() => {
    expect(eventHandler).toHaveBeenCalledWith({
      state: { expr: 'hola', attempt: '' },
    })
  })
})
