import { extractFormData } from '../form'
import { action, createAsync, query } from '@solidjs/router'
import { createEffect, createMemo, createSignal, For, type JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Dynamic } from 'solid-js/web'
import z from 'zod/v4'
import Button from '~/components/Button'
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
    state: z.ZodOptional<T['steps'][K & string]>
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
          z.object({ name: z.literal(name), state: state.optional() }),
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
    onChange?: (event: {
      newState: z.infer<T['steps'][N]>
      feedback: Awaited<ReturnType<typeof step.feedback>>
    }) => Promise<void> | void
  }) {
    const [state, setState] = createSignal(props.state)
    createEffect(async () => {
      setState(() => props.state)
    })
    const feedback = createAsync(async () => {
      if (state()) return getFeedback(props.question, state()!)
    })
    const submit = action(async (form: FormData) => {
      const newState = await step.stepSchema.parseAsync(extractFormData(form))
      const feedback = await getFeedback(props.question, newState)
      setState(() => newState)
      await props.onChange?.({ newState, feedback })
      return feedback
    })
    return (
      <form method="post" action={submit}>
        <Suspense>
          <ErrorBoundary>
            <step.View question={props.question} state={state()} feedback={feedback()} />
          </ErrorBoundary>
        </Suspense>
        <Button>Corriger</Button>
      </form>
    )
  }
}

export type ExerciseType = {
  schema: Schema
  steps: ReturnType<typeof defineStep>[]
}

export function buildExercise<T extends ExerciseType>(exercise: T) {
  const step = (name: keyof T['schema']['steps']) =>
    exercise.steps.filter((e) => e.name === name).at(0)
  const Step = (name: keyof T['schema']['steps']) => buildStep(step(name))
  return function (props: {
    question: z.infer<T['schema']['question']>
    attempt?: z.infer<AttemptSchema<T['schema']>>[]
    onChange?: (event: { attempt: z.infer<AttemptSchema<T['schema']>>[] }) => void | Promise<void>
  }) {
    const [attempt, setAttempt] = createStore(props.attempt ?? [])
    createEffect(() => setAttempt(props.attempt ?? []))
    return (
      <For each={attempt.length ? attempt : [{ name: exercise.steps[0].name, state: undefined }]}>
        {(part, i) => (
          <Dynamic
            component={Step(part.name)}
            question={props.question}
            state={part.state}
            onChange={(e) => {
              setAttempt(i(), {
                name: part.name,
                state: e.newState,
              } as z.infer<AttemptSchema<T['schema']>>)
              if (i() >= attempt.length - 1 && e.feedback.next) {
                setAttempt([
                  ...attempt,
                  {
                    name: e.feedback.next,
                  } as z.infer<AttemptSchema<T['schema']>>,
                ])
              }
              props.onChange?.({ attempt })
            }}
          />
        )}
      </For>
    )
  }
}
