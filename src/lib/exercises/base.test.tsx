import { createExerciseType } from './base'
import { createMemoryHistory, MemoryRouter, Route } from '@solidjs/router'
import { render, waitFor } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { z } from 'zod'

const { Component } = createExerciseType({
  name: 'Test',
  schema: z.object({
    expr: z.string(),
    attempt: z.string(),
  }),
  mark: (state) => state.expr === state.attempt,
  solve: (state) => ({ ...state, attempt: state.expr }),
  Component: (props) => (
    <>
      <p>Copy the expression {props.expr} exactly as is</p>
      <label>
        Your attempt:
        <input name="attempt" value={props.attempt} />
      </label>
    </>
  ),
})

const user = userEvent.setup()
const handleSubmit = vi.fn((event: { state: any }) => {
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
          <Component state={{ expr: 'hello', attempt: '' }} onSubmit={handleSubmit} />
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
  expect(handleSubmit).toHaveBeenCalledWith({
    state: { expr: 'hello', attempt: 'world' },
    feedback: { correct: false, solution: { expr: 'hello', attempt: 'hello' } },
  })
})
