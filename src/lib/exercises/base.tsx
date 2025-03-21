import { extractFormData } from '../form'
import { faCheckCircle, faXmark } from '@fortawesome/free-solid-svg-icons'
import { action, createAsyncStore, useSubmission } from '@solidjs/router'
import { Component, Show, type JSXElement } from 'solid-js'
import { z } from 'zod'
import Fa from '~/components/Fa'

type Feedback<Solution> = {
  correct: boolean
  solution?: Solution
}

export type ExerciseComponentProps<State, Params, Solution> = (
  | {
      params: Params
      state?: never
    }
  | {
      params?: never
      state: State
    }
) & {
  feedback?: Feedback<Solution>
  onSubmit?: (event: { state: State; feedback: Feedback<Solution> }) => Promise<void> | void
  onGenerate?: (event: { state: State }) => Promise<void> | void
}
type ExerciseComponent<State, Params, Solution> = Component<
  ExerciseComponentProps<State, Params, Solution>
>

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
  schema: Schema
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
  /**
   * Function that solves an exercise
   * @param state question and student's answer
   * @returns props for the Solution component
   */
  solve?: (state: z.infer<Schema>) => Promise<Solution> | Solution
  /**
   * Component for showing a detailed resolution
   * @param props Output of the 'solve' function
   */
  Solution?: (props: Solution) => JSXElement
  /**
   * Zod Schema to validate the generator parameters
   */
  params?: GeneratorSchema
  /**
   * Function that generates a new exercise
   * @param params parameters that satisfy the 'params' schema
   * @returns state for the main component
   */
  generator?: (params: z.infer<GeneratorSchema>) => Promise<z.input<Schema>> | z.input<Schema>
}

/**
 * Create an exercise type from its building blocks
 *
 * - Only show the exercise if props.state is supplied
 * - Generate an exercise otherwise and emit an 'onGenerate' event
 * - Handle basic validation and submission logic and emit an 'onSubmit' event
 * - Show feedback if and only if props.feedback is supplied
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
  Sol extends object,
>(exercise: ExerciseType<Name, Schema, G, Sol>) {
  const Component: ExerciseComponent<z.infer<Schema>, z.infer<G>, Sol> = (props) => {
    const state = createAsyncStore(
      async () => {
        if (props.params && !props.state && exercise.generator) {
          const newState = await exercise.generator(props.params)
          props.onGenerate?.({ state: await exercise.schema.parseAsync(newState) })
          return newState
        }
        return props.state
      },
      { initialValue: props.state },
    )

    const formAction = action(
      async (initialState: z.infer<Schema>, formData: FormData) => {
        const newState: z.infer<Schema> = await exercise.schema.parseAsync({
          ...initialState,
          ...extractFormData(formData),
        })
        const [correct, solution] = await Promise.all([
          exercise.mark(newState),
          exercise.solve?.(newState),
        ])
        await props.onSubmit?.({
          state: newState,
          feedback: {
            correct,
            solution: solution || undefined,
          },
        })
      },
      `exercise-${btoa(JSON.stringify(props.state))}`,
    )
    const submission = useSubmission(formAction)

    return (
      <>
        <div class="bg-white border rounded-xl p-4 my-8">
          <Show when={state()} fallback={<p>Generating...</p>}>
            <form method="post" action={formAction.with(state())}>
              <fieldset disabled={props.feedback !== undefined}>
                <exercise.Component {...state()} />
              </fieldset>
              {!props.feedback && (
                <button type="submit" disabled={submission.pending}>
                  {submission.pending ? 'Correction en cours' : 'Corriger'}
                </button>
              )}
            </form>
          </Show>
        </div>
        <Show when={props.feedback}>
          {(feedback) => (
            <Feedback {...feedback()}>
              <Show when={feedback().solution}>
                {(solution) => exercise.Solution && <exercise.Solution {...solution()} />}
              </Show>
            </Feedback>
          )}
        </Show>
      </>
    )
  }
  let common = z.object({
    type: z.literal(exercise.name),
    feedback: z
      .object({
        correct: z.boolean(),
        solution: z.any(),
      })
      .optional(),
  })
  const state = common.extend({
    state: exercise.schema,
    params: z.never().optional(),
  })
  const params = common.extend({
    params: exercise.params || z.never(),
    state: z.never().optional(),
  })
  return {
    Component,
    schema: exercise.params ? state.or(params) : state,
    mark: exercise.mark,
  }
}

function Feedback<S>(props: { children: JSXElement; correct: boolean; solution?: S }) {
  return (
    <div class="bg-white border rounded-xl p-4 my-8">
      <Show
        when={props.correct}
        fallback={
          <p class="text-red-800 font-bold text-2xl mb-4">
            <Fa icon={faXmark} /> Pas de chance&nbsp;!
          </p>
        }
      >
        <p class="text-green-800 font-bold text-2xl mb-4">
          <Fa icon={faCheckCircle} /> Correct&nbsp;!
        </p>
      </Show>
      {props.children}
    </div>
  )
}
