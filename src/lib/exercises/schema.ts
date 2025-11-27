import z from 'zod/v4'
import { type StepTemplate, type Schema } from '~/lib/exercises/type'

export function buildSchema<Q extends z.ZodObject, S extends StepTemplate, P extends undefined>(
  schema: Schema<Q, S, P>,
): z.ZodObject<{ question: Q; attempt: z.ZodArray<S> }>
export function buildSchema<Q extends z.ZodObject, S extends StepTemplate, P extends z.ZodObject>(
  schema: Schema<Q, S, P>,
): z.ZodUnion<
  [
    z.ZodObject<{ question: Q; attempt: z.ZodArray<S> }>,
    z.ZodObject<{ params: P; attempt: z.ZodArray<S> }>,
  ]
>
export function buildSchema<Q, S extends StepTemplate, P>(schema: Schema<Q, S, P>) {
  if (schema.params === undefined) {
    return z.object({
      question: schema.question,
      attempt: schema.steps.array(),
    })
  } else {
    return z.union([
      z.object({
        question: schema.question,
        attempt: schema.steps.array(),
      }),
      z.object({
        params: schema.params,
        attempt: schema.steps.array(),
      }),
    ])
  }
}
