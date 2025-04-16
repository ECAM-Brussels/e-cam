import { extractFormData } from '../form'
import { createAsync } from '@solidjs/router'
import { Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { z } from 'zod'
import Button from '~/components/Button'
import ZodError from '~/components/ZodError'
import Feedback from '~/lib/exercises/feedback'
import { optionsSchema, type ExerciseType, type Options } from '~/lib/exercises/schemas'

export type ExerciseProps<Name, State, Params, Feedback> = {
  type: Name
  onChange?: (
    exercise: Omit<ExerciseProps<Name, State, Params, Feedback>, 'onChange' | 'params'> & {
      state: State
    },
  ) => Promise<void> | void
  options: Options
  attempts: { correct: boolean; state: State; feedback?: Feedback }[]
} & ({ state: State } | { params: Params })

/**
 * Create an exercise type from its building blocks
 *
 * - Only show the exercise if props.state is supplied
 * - Generate an exercise otherwise and emit an 'onChange' event
 * - Handle basic validation and submission logic and emit an 'onChange' event
 *
 * @param exercise Exercise data
 * @returns A full-featured exercise component, and a schema for validation
 * @example
 * const { Component, schema } = createExerciseType(exercise)
 * export { Component as default, schema }
 */
export function createExerciseType<
  Name extends string,
  Schema extends z.ZodTypeAny,
  G extends z.ZodTypeAny,
  Feedback extends object,
>(exercise: ExerciseType<Name, Schema, G, Feedback>) {
  function Component(props: ExerciseProps<Name, z.infer<Schema>, z.infer<G>, Feedback>) {
    const state = createAsync(async () => {
      if ('state' in props) return props.state
      if (!exercise.generator) throw new Error('Exercise does not accept params.')
      const { params, onChange, ...data } = props
      const newState = await exercise.generator.generate(params)
      await onChange?.({ ...data, state: await exercise.state.parseAsync(newState) })
      return newState
    })

    const [getFeedback, ExerciseFeedback] = exercise.feedback || [undefined, undefined]
    const remaining = (offset?: number) => {
      if (props.attempts.at(-1)?.correct) {
        return 0
      }
      return props.options.maxAttempts === null
        ? true
        : props.options.maxAttempts - props.attempts.length + (offset ?? 0)
    }
    const readOnly = () => remaining() === 0 || props.attempts.at(-1)?.correct

    const [submission, setSubmission] = createStore<{ pending: boolean; error?: z.ZodError }>({
      pending: false,
    })

    async function mark(state: z.infer<Schema>) {
      try {
        return await exercise.mark(state)
      } catch {
        return false
      }
    }

    async function handleSubmit(event: SubmitEvent) {
      event.preventDefault()
      setSubmission('pending', true)
      setSubmission('error', undefined)
      try {
        const newState: z.infer<Schema> = await exercise.state.parseAsync({
          ...state(),
          ...extractFormData(new FormData(event.target as HTMLFormElement)),
        })
        const [correct, feedback] = await Promise.all([
          mark(newState),
          getFeedback?.(newState, remaining(-1)),
        ])
        const { onChange, ...data } = props
        const attempt = { correct, state: newState, feedback }
        const attempts =
          props.options.maxAttempts === null ? [attempt] : [...props.attempts, attempt]
        await onChange?.({ ...data, state: newState, attempts })
        setSubmission('pending', false)
      } catch (error) {
        if (error instanceof z.ZodError) {
          setSubmission('error', error)
        }
        setSubmission('pending', false)
      }
    }

    return (
      <Show when={state()} fallback={<p>Generating...</p>}>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={readOnly()} class="bg-white border rounded-xl p-4 my-4">
            <exercise.Component {...state()} />
            <ZodError error={submission.error} />
          </fieldset>
          <Show when={!readOnly() && !submission.pending}>
            <div class="text-center my-4">
              <Button type="submit" color="green">
                Corriger
              </Button>
            </div>
          </Show>
        </form>
        <Feedback
          attempts={props.attempts}
          maxAttempts={props.options.maxAttempts}
          component={ExerciseFeedback}
          marking={submission.pending}
        />
      </Show>
    )
  }
  const schema = z.object({
    type: z.literal(exercise.name),
    maxAttempts: z.null().or(z.number()).optional(),
    options: optionsSchema,
    attempts: z
      .object({
        correct: z.boolean(),
        state: exercise.state,
        feedback: z.any(),
      })
      .array()
      .default([]),
    state: exercise.state.optional(),
    params: exercise.generator?.params.optional() ?? z.undefined(),
  })
  return { Component, schema, mark: exercise.mark }
}
