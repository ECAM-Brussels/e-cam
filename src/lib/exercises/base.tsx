import { extractFormData } from '../form'
import Feedback from './feedback'
import { action, createAsyncStore, useSubmission } from '@solidjs/router'
import { Show, type JSXElement } from 'solid-js'
import { z } from 'zod'
import Button from '~/components/Button'

/**
 * Type used to describe how exercises types are created.
 * This type does not need to be exported,
 * as it should be inferred via the `createExerciseType` function.
 */
type ExerciseType<
  Name extends string,
  Schema extends z.ZodTypeAny,
  GeneratorSchema extends z.ZodTypeAny,
  Solution extends object,
> = {
  /**
   * Name of the exercise type.
   * Must be the name used for the component as well.
   */
  name: Name
  /**
   * Zod Schema to validate the state of the exercise,
   * i.e. question and student's answer.
   */
  state: Schema
  /**
   * Component for the main UI
   * Doesn't need to show the solution or handle the generator.
   * @param props state of the exercise
   */
  Component: (props: z.infer<Schema>) => JSXElement
  /**
   * Marking/grading function.
   * Can be asynchronous but needs to run on the server
   * @param state question and student's answer
   * @returns whether the student's answer is correct
   */
  mark: (state: z.infer<Schema>) => Promise<boolean> | boolean

  feedback?: [
    (state: z.infer<Schema>, remaniningAttempts: true | number) => Promise<Solution> | Solution,
    (props: Solution) => JSXElement,
  ]

  generator?: {
    params: GeneratorSchema
    generate: (params: z.infer<GeneratorSchema>) => Promise<z.input<Schema>> | z.input<Schema>
  }
}

export type ExerciseProps<Name, State, Params, Feedback> = {
  type: Name
  onChange?: (
    exercise: Omit<ExerciseProps<Name, State, Params, Feedback>, 'onChange' | 'params'> & {
      state: State
    },
  ) => Promise<void> | void
  maxAttempts: null | number
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
    const state = createAsyncStore(async () => {
      if ('state' in props) return props.state
      if (!exercise.generator) throw new Error('Exercise does not accept params.')
      const { params, onChange, ...data } = props
      const newState = await exercise.generator.generate(params)
      await onChange?.({ ...data, state: await exercise.state.parseAsync(newState) })
      return newState
    })

    const [getFeedback, ExerciseFeedback] = exercise.feedback || [undefined, undefined]
    const remaining = () => {
      if (props.attempts.at(-1)?.correct) {
        return 0
      }
      return props.maxAttempts === null ? true : props.maxAttempts - props.attempts.length
    }
    const readOnly = () => remaining() === 0 || props.attempts.at(-1)?.correct

    const formAction = action(
      async (initialState: z.infer<Schema>, formData: FormData) => {
        const newState: z.infer<Schema> = await exercise.state.parseAsync({
          ...initialState,
          ...extractFormData(formData),
        })
        const [correct, feedback] = await Promise.all([
          exercise.mark(newState),
          getFeedback?.(newState, remaining()),
        ])
        const { onChange, ...data } = props
        await onChange?.({
          ...data,
          state: newState,
          attempts: [...props.attempts, { correct, state: newState, feedback }],
        })
      },
      `exercise-${btoa(JSON.stringify(state()))}`,
    )
    const submission = useSubmission(formAction)

    return (
      <Show when={state()} fallback={<p>Generating...</p>}>
        <form method="post" action={formAction.with(state())}>
          <fieldset disabled={readOnly()} class="bg-white border rounded-xl p-4 my-4">
            <exercise.Component {...state()} />
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
          maxAttempts={props.maxAttempts}
          component={ExerciseFeedback}
          marking={submission.pending}
        />
      </Show>
    )
  }
  const schema = z
    .object({
      type: z.literal(exercise.name),
      maxAttempts: z.null().or(z.number()).optional(),
      attempts: z
        .object({
          correct: z.boolean(),
          state: exercise.state,
          feedback: z.any(),
        })
        .array()
        .default([]),
    })
    .and(
      exercise.generator?.params
        ? z.object({ state: exercise.state }).or(z.object({ params: exercise.generator.params }))
        : z.object({ state: exercise.state }),
    )
  return { Component, schema, mark: exercise.mark }
}
