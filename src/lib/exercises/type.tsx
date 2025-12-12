import { extractFormData } from '../form'
import { action, createAsync, query } from '@solidjs/router'
import { createEffect, createSignal, type JSX } from 'solid-js'
import z from 'zod/v4'
import ErrorBoundary from '~/components/ErrorBoundary'
import Suspense from '~/components/Suspense'

export type Schema = {
  name: string
  question: z.ZodObject
  steps: Record<string, z.ZodObject>
  params?: z.ZodObject
}

type AttemptSchema<T extends Schema> = {
  [K in keyof T['steps']]: z.ZodObject<{
    name: z.ZodLiteral<K & string>
    state: T['steps'][K & string]
  }>
}[keyof T['steps']]

type FullSchema<T extends Schema> = z.ZodObject<{
  question: T['question']
  attempt: z.ZodOptional<z.ZodArray<z.ZodUnion<AttemptSchema<T>[]>>>
}>

export function buildSchema<T extends Schema>(schema: T): FullSchema<T> {
  return z.object({
    question: schema.question,
    attempt: z
      .union(
        Object.entries(schema.steps).map(([name, state]) =>
          z.object({ name: z.literal(name), state }),
        ) as AttemptSchema<T>[],
      )
      .array()
      .optional(),
  })
}

type Step<Q, S, F> = {
  feedback: (question: Q, state: S) => Promise<F>
  View: (props: { question: Q; state?: S; feedback?: F }) => JSX.Element
}

export function defineStep<T extends Schema, N extends keyof T['steps'] & string, F>(
  schema: T,
  name: N,
  step: Step<
    z.infer<T['question']>,
    z.infer<T['steps'][N]>,
    { correct: boolean; next: keyof T['steps'] | null; data: F }
  >,
) {
  return { ...step, name, schema, stepSchema: schema.steps[name] as T['steps'][N] }
}

export function buildStep<T extends Schema, N extends keyof T['steps'] & string, F>(
  step: ReturnType<typeof defineStep<T, N, F>>,
) {
  const getFeedback = query(step.feedback, `exercise-${step.schema.name}-${step.name}`)
  return function (props: {
    question: z.infer<T['question']>
    state?: z.infer<T['steps'][N]>
    onChange?: (
      newState: z.infer<T['steps'][N]>,
      feedback: Awaited<ReturnType<typeof step.feedback>>,
    ) => Promise<void>
  }) {
    const [state, setState] = createSignal(props.state)
    createEffect(() => setState(() => props.state))
    const feedback = createAsync(async () => {
      if (state()) return getFeedback(props.question, state()!)
    })
    const submit = action(async (form: FormData) => {
      const newState = await step.stepSchema.parseAsync(extractFormData(form))
      const feedback = await getFeedback(props.question, newState)
      await props.onChange?.(newState, feedback)
      setState(() => newState)
      return feedback
    })
    return (
      <form method="post" action={submit}>
        <Suspense>
          <ErrorBoundary>
            <step.View question={props.question} state={state()} feedback={feedback()} />
          </ErrorBoundary>
        </Suspense>
      </form>
    )
  }
}
