import type { JSX } from 'solid-js'
import z from 'zod/v4'

type StepTemplate = z.ZodDiscriminatedUnion<
  z.ZodObject<{ name: z.ZodLiteral; state: z.ZodObject }>[]
>
export type Schema<Q = z.ZodObject, S = StepTemplate, P = z.ZodObject> = {
  question: Q
  steps: S
  params?: P
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

export const start = defineStep(schema, 'start', {
  async feedback(question, state) {
    const correct = state.attempt === 'hello'
    return { correct: true, feedback: { hello: 'world' } }
  },
  View(props) {
    return <p>Hello world {props.feedback?.hello}</p>
  },
})
