import { action, createAsync, query } from '@solidjs/router'
import { sample } from 'lodash-es'
import { createEffect, createSignal, For, type JSX, lazy, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Dynamic } from 'solid-js/web'
import z from 'zod/v4'
import Button from '~/components/Button'
import ErrorBoundary from '~/components/ErrorBoundary'
import Suspense from '~/components/Suspense'
import { extractFormData } from '~/lib/form'

export type Schema = {
  name: string
  question: z.ZodObject
  steps: Record<string, z.ZodObject>
  params?: Record<string, z.ZodTypeAny>
}

type AttemptSchema<T extends Schema> = {
  [K in keyof T['steps']]: z.ZodObject<{
    name: z.ZodLiteral<K & string>
    state: z.ZodOptional<T['steps'][K & string]>
  }>
}[keyof T['steps']]

type WithQuestion<T extends Schema> = z.ZodObject<{
  question: T['question']
  attempt: z.ZodOptional<z.ZodArray<z.ZodUnion<AttemptSchema<T>[]>>>
}>

type ParamsSchema<T extends Schema> = T extends { params: object }
  ? z.ZodObject<{
      [K in keyof T['params']]: z.ZodArray<T['params'][K]>
    }>
  : never

type WithParams<T extends Schema> = T extends { params: object }
  ? z.ZodObject<{
      params: ParamsSchema<T>
      attempt: z.ZodOptional<z.ZodArray<z.ZodUnion<AttemptSchema<T>[]>>>
    }>
  : never

export function buildSchema<T extends Schema & { params: object }>(
  schema: T,
): z.ZodUnion<[WithParams<T>, WithQuestion<T>]>
export function buildSchema<T extends Schema & object>(schema: T): WithQuestion<T>
export function buildSchema<T extends Schema>(schema: T) {
  const attempt = z
    .union(
      Object.entries(schema.steps).map(([name, state]) =>
        z.object({ name: z.literal(name), state: state.optional() }),
      ),
    )
    .array()
    .optional()
  const withQuestion = z.object({ question: schema.question, attempt })
  if (schema.params) {
    const params = z.object(
      Object.fromEntries(
        Object.entries(schema.params).map(([param, paramSchema]) => {
          return [param, paramSchema.array().nonempty()]
        }),
      ),
    )
    const withParams = z.object({ params, attempt })
    return z.union([withParams, withQuestion])
  }
  return withQuestion
}

type Step<Q, S, F> = {
  feedback: (question: Q, state: S) => Promise<F>
  View: (props: {
    question: Q
    state?: S
    feedback?: F
    context: { readOnly: boolean }
  }) => JSX.Element
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
    context: { readOnly: boolean }
    onChange?: (event: {
      newState: z.infer<T['steps'][N]>
      feedback: Awaited<ReturnType<typeof step.feedback>>
    }) => Promise<void> | void
  }) {
    const [state, setState] = createSignal(props.state)
    createEffect(() => setState(() => props.state))
    const feedback = createAsync(
      async () => {
        if (state()) return getFeedback(props.question, state()!)
      },
      { initialValue: undefined },
    )
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
            <step.View
              context={props.context}
              question={props.question}
              state={state()}
              feedback={feedback()}
            />
          </ErrorBoundary>
        </Suspense>
        <Show when={!props.context.readOnly}>
          <Button color="green">Corriger</Button>
        </Show>
      </form>
    )
  }
}

type Steps<T extends Schema> = {
  [K in keyof T['steps'] & string]: ReturnType<typeof defineStep<T, K, any>>
}[keyof T['steps'] & string][]

export function defineExercise<T extends Schema, S extends Steps<T>>(
  exercise: {
    schema: T
    steps: S
  } & (T['params'] extends object
    ? {
        generator: (params: z.infer<z.ZodObject<T['params']>>) => Promise<z.infer<T['question']>>
      }
    : {}),
) {
  return exercise
}

export function buildExercise<
  T extends Schema & ({ params: object } | { params: undefined }),
  S extends Steps<T>,
>(exercise: ReturnType<typeof defineExercise<T, S>>) {
  const step = (name: keyof T['steps']) => exercise.steps.filter((e) => e.name === name).at(0)!
  const Step = (name: keyof T['steps']) => buildStep(step(name))
  return function (
    props: {
      attempt?: z.infer<AttemptSchema<T>>[]
      onChange?: (event: { attempt: z.infer<AttemptSchema<T>>[] }) => void | Promise<void>
    } & (T['params'] extends object
      ?
          | {
              params: z.infer<ParamsSchema<T>>
            }
          | {
              question: z.infer<T['question']>
            }
      : {
          question: z.infer<T['question']>
        }),
  ) {
    const getQuestion = query(
      async (data: { question: z.infer<T['question']> } | { params: z.infer<ParamsSchema<T>> }) => {
        if ('question' in data) return data.question
        if ('generator' in exercise && 'params' in exercise.schema && exercise.schema.params) {
          const paramsSchema = z.object(exercise.schema.params) as z.ZodObject<
            NonNullable<T['params']>
          >
          const params = paramsSchema.parse(
            Object.fromEntries(
              Object.entries(data.params).map(([param, values]) => [param, sample(values!)]),
            ),
          )
          return await exercise.generator(params)
        }
        throw new Error('A question could not be generated')
      },
      `exercise-${exercise.schema.name}-question`,
    )
    const question = createAsync(() => getQuestion(props))
    const [attempt, setAttempt] = createStore(props.attempt ?? [])
    createEffect(() => setAttempt(props.attempt ?? []))
    return (
      <For each={attempt.length ? attempt : [{ name: exercise.steps[0].name, state: undefined }]}>
        {(part, i) => (
          <Suspense>
            <Show when={question()}>
              {(question) => (
                <Dynamic
                  component={Step(part.name)}
                  question={question() as z.infer<T['question']>}
                  state={part.state}
                  context={{ readOnly: attempt.length > 0 && i() < attempt.length - 1 }}
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
            </Show>
          </Suspense>
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
