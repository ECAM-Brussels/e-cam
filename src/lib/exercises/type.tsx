import { extractFormData } from '../form'
import { action, createAsync, query } from '@solidjs/router'
import { createEffect, createSignal, For, type JSX, lazy } from 'solid-js'
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
type Attempt<T extends Schema> = z.infer<AttemptSchema<T>>

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
    createEffect(() => setState(() => props.state))
    const feedback = createAsync(async () => {
      if (state()) return getFeedback(props.question, state()!)
    })
    const submit = action(async (form: FormData) => {
      const newState = await step.stepSchema.parseAsync(extractFormData(form))
      const feedback = await getFeedback(props.question, newState)
      setState(() => newState)
      await props.onChange?.({ newState, feedback })
      return feedback
    }, `exercise-${step.schema.name}-${step.name}-action`)
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

type Steps<T extends Schema> = {
  [K in keyof T['steps'] & string]: ReturnType<typeof defineStep<T, K, any>>
}[keyof T['steps'] & string][]

export function defineExercise<T extends Schema, S extends Steps<T>>(exercise: {
  schema: T
  steps: S
}) {
  return exercise
}

export function buildExercise<T extends Schema, S extends Steps<T>>(
  exercise: ReturnType<typeof defineExercise<T, S>>,
) {
  const step = (name: keyof T['steps']) => exercise.steps.filter((e) => e.name === name).at(0)!
  const Step = (name: keyof T['steps']) => buildStep(step(name))
  return function (props: {
    question: z.infer<T['question']>
    attempt?: z.infer<AttemptSchema<T>>[]
    onChange?: (event: { attempt: z.infer<AttemptSchema<T>>[] }) => void | Promise<void>
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
            onChange={async ({ feedback, newState }) => {
              setAttempt(i(), {
                name: part.name,
                state: newState,
              } as z.infer<AttemptSchema<T>>)
              if (i() >= attempt.length - 1 && feedback.next) {
                setAttempt([
                  ...attempt,
                  {
                    name: feedback.next,
                  } as z.infer<AttemptSchema<T>>,
                ])
              }
              await props.onChange?.({ attempt })
            }}
          />
        )}
      </For>
    )
  }
}

export function loadExercise<T extends Schema, S extends Steps<T>>(
  importModule: () => Promise<{ schema: T; default: ReturnType<typeof defineExercise<T, S>> }>,
) {
  return lazy(async () => {
    const module = await importModule()
    return {
      default: buildExercise(module.default),
    }
  })
}
