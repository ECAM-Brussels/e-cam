import type { JSX } from 'solid-js'
import z from 'zod/v4'

type StepTemplate = z.ZodDiscriminatedUnion<
  z.ZodObject<{ name: z.ZodLiteral; state: z.ZodObject }>[]
>
export type Schema<Q = z.ZodObject, S = StepTemplate, P = z.ZodObject | undefined> = {
  question: Q
  steps: S
  params?: P
}

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

type Unwrap<T> = T extends (infer U)[] ? U : T
type StepSchema<Q, S, P> = Unwrap<z.infer<Schema<Q, S, P>['steps']>>
type Step<Q, S, K, F> = {
  feedback: (question: Q, state: S) => Promise<{ correct: boolean; next?: K; feedback: F }>
  View: (props: { question: Q; state?: S; feedback?: F }) => JSX.Element
}

export function defineStep<Q, S extends StepTemplate, P, N extends StepSchema<Q, S, P>['name'], F>(
  _schema: Schema<Q, S, P> & Schema,
  _stepName: N,
  step: Step<
    z.infer<Q>,
    Extract<StepSchema<Q, S, P>, { name: N }>['state'],
    StepSchema<Q, S, P>['name'],
    F
  >,
) {
  return step
}

export function defineGenerator<Q, P>(
  _schema: Schema<Q, StepTemplate, P> & Schema,
  fn: (params: { [K in keyof z.infer<P>]: Unwrap<z.infer<P>[K]> }) => Promise<z.infer<Q>>,
) {
  return fn
}

export const schema = {
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
  params: z.object({
    x1: z.string().array(),
  }),
} satisfies Schema

const transformed = buildSchema(schema)
type Inferred = z.infer<typeof transformed>

const generator = defineGenerator(schema, async ({ x1 }) => {
  return { expr: `(x - ${x1}) (x - ${x1})` }
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
