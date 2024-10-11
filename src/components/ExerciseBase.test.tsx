import ExerciseBase, { ExerciseProps } from './ExerciseBase'
import { render } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { createStore } from 'solid-js/store'
import { expect, test } from 'vitest'
import { z } from 'zod'

const schema = z.object({ question: z.number(), attempt: z.number().optional() })
type State = z.infer<typeof schema>
type Params = {}

let count = 0
function generate(params: Params): State {
  count += 1
  return { question: count }
}

test('generator works', async () => {
  const [data, setData] = createStore<Omit<ExerciseProps<State, Params>, 'setter'>>({
    initialOptions: {
      readOnly: false,
      remainingAttempts: true,
      showSolution: false,
    },
    params: {},
  })

  const user = userEvent.setup()
  const { container, findByText, findByRole } = render(() => (
    <ExerciseBase
      type="Test"
      {...data}
      setter={setData}
      mark={(state) => state.question === state.attempt}
      schema={schema}
      generate={generate}
    >
      <p>Hello</p>
    </ExerciseBase>
  ))

  // Check generator
  expect(await findByText('Hello')).not.toBeFalsy()
  expect(data.state).toEqual({ question: 1 })
  expect(data.feedback).not.toHaveProperty('correct')

  // Submit wrong answer
  setData('state', 'attempt', 0)
  let button = await findByRole('button')
  expect(button).not.toBeFalsy()
  await user.click(button)

  // Marking
  expect(data.feedback).toHaveProperty('correct')
  expect(data.feedback?.correct).toBe(false)
  expect(await findByText('Pas de chance !')).not.toBeFalsy()

  // Resubmit correct response
  setData('state', 'attempt', 1)
  button = await findByRole('button')
  await user.click(button)

  // Marking
  expect(data.feedback).toHaveProperty('correct')
  expect(data.feedback?.correct).toBe(true)
  expect(await findByText('Correct !')).not.toBeFalsy()
})
