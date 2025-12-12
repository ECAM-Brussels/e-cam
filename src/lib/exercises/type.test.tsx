import { buildSchema, type Schema } from './type'
import { test, expect } from 'vitest'
import z from 'zod/v4'

test('exercise schema is correct', async () => {
  const schema = {
    name: 'test',
    question: z.object({ expr: z.string() }),
    steps: {
      start: z.object({ attempt: z.string() }),
    },
  } satisfies Schema
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
