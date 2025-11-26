import type { JSX } from 'solid-js'
import z from 'zod/v4'

type SchemaInput<Q, S, P> = {
  question: Q
  steps: S
  params?: P
}

type StepSchema = z.ZodDiscriminatedUnion<z.ZodObject<{ name: z.ZodLiteral; state: z.ZodObject }>[]>

export function defineSchema<
  Q extends z.ZodObject,
  S extends StepSchema,
  P extends z.ZodObject | undefined,
>(schema: SchemaInput<Q, S, P>) {
  return z.object({
    attempt: schema.steps.array().default([]),
    question: schema.question,
  })
}

type SchemaOutput<
  Q extends z.ZodObject,
  S extends StepSchema,
  P extends z.ZodObject | undefined,
> = ReturnType<typeof defineSchema<Q, S, P>>

type Step<Q, S, K, F> = {
  feedback: (question: Q, state: S) => Promise<{ correct: boolean; next?: K; feedback: F }>
  View: (props: { question: Q; state?: S; feedback?: F }) => JSX.Element
}

type UnwrapArray<T> = T extends (infer U)[] ? U : T

type Attempt<
  Q extends z.ZodObject,
  S extends StepSchema,
  P extends z.ZodObject | undefined,
> = z.infer<SchemaOutput<Q, S, P>>['attempt']

function defineStep<
  Q extends z.ZodObject,
  S extends StepSchema,
  P extends z.ZodObject | undefined,
  N extends UnwrapArray<Attempt<Q, S, P>>['name'],
  F,
>(
  _schema: SchemaOutput<Q, S, P>,
  _stepName: N,
  step: Step<
    z.infer<Q>,
    Extract<Attempt<Q, S, P>[number], { name: N }>['state'],
    UnwrapArray<Attempt<Q, S, P>>['name'],
    F
  >,
) {
  return step
}

export const schema = defineSchema({
  question: z.object({ expr: z.string() }),
  steps: z.discriminatedUnion('name', [
    z.object({
      name: z.literal('start'),
      state: z.object({ attempt: z.string() }),
    }),
    z.object({
      name: z.literal('root'),
      state: z.object({ root: z.string() }),
    }),
  ]),
})

export const start = defineStep(schema, 'start', {
  async feedback(question, state) {
    const correct = state.attempt === 'hello'
    return { correct: true, feedback: { hello: 'world' } }
  },
  View(props) {
    return <p>Hello world {props.feedback?.hello}</p>
  },
})
