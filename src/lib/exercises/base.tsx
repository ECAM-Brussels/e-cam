import { extractFormData } from '../form'
import { faCheckCircle, faHourglassHalf, faXmark } from '@fortawesome/free-solid-svg-icons'
import { action, createAsyncStore, useSubmission } from '@solidjs/router'
import { Component, Show, type JSXElement } from 'solid-js'
import { z } from 'zod'
import Button from '~/components/Button'
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
  onSubmit?: (event: {
    state: State
    feedback: Feedback<Solution>
    attempts: true | number
  }) => Promise<void> | void
  onGenerate?: (event: { state: State; attempts: true | number }) => Promise<void> | void
  attempts: true | number
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
    (state: z.infer<Schema>, attempts: true | number) => Promise<Solution> | Solution,
    (props: Solution) => JSXElement,
  ]

  generator?: {
    params: GeneratorSchema
    generate: (params: z.infer<GeneratorSchema>) => Promise<z.input<Schema>> | z.input<Schema>
  }
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
          const newState = await exercise.generator.generate(props.params)
          props.onGenerate?.({
            state: await exercise.state.parseAsync(newState),
            attempts: props.attempts,
          })
          return newState
        }
        return props.state
      },
      { initialValue: props.state },
    )

    const [solve, Solution] = exercise.feedback || [undefined, undefined]

    const formAction = action(
      async (initialState: z.infer<Schema>, formData: FormData) => {
        const newState: z.infer<Schema> = await exercise.state.parseAsync({
          ...initialState,
          ...extractFormData(formData),
        })
        const [correct, solution] = await Promise.all([
          exercise.mark(newState),
          solve?.(newState, props.attempts),
        ])
        await props.onSubmit?.({
          state: newState,
          feedback: {
            correct,
            solution: solution || undefined,
          },
          attempts: typeof props.attempts === 'number' ? props.attempts - 1 : true,
        })
      },
      `exercise-${btoa(JSON.stringify(props.state))}`,
    )
    const submission = useSubmission(formAction)

    const readOnly = () => props.attempts === 0 || props.feedback?.correct

    return (
      <>
        <Show when={state()} fallback={<p>Generating...</p>}>
          <form method="post" action={formAction.with(state())}>
            <fieldset disabled={readOnly()}>
              <div class="bg-white border rounded-xl p-4 my-4">
                <exercise.Component {...state()} />
              </div>
              <Show when={!readOnly() && !submission.pending}>
                <div class="text-center my-4">
                  <Button type="submit" color="green">
                    Corriger
                  </Button>
                </div>
              </Show>
            </fieldset>
          </form>
        </Show>
        <Show when={props.feedback}>
          {(feedback) => (
            <Feedback {...feedback()} attempts={props.attempts}>
              <Show when={exercise.feedback && feedback().solution}>
                {(solution) => Solution && <Solution {...solution()} attempts={props.attempts} />}
              </Show>
            </Feedback>
          )}
        </Show>
        <Show when={submission.pending}>
          <Feedback marking />
        </Show>
      </>
    )
  }
  let common = z.object({
    type: z.literal(exercise.name),
    attempts: z.literal(true).or(z.number()).optional(),
    feedback: z
      .object({
        correct: z.boolean(),
        solution: z.any(),
      })
      .optional(),
  })
  const state = common.extend({
    state: exercise.state,
    params: z.never().optional(),
  })
  const params = common.extend({
    params: exercise.generator?.params || z.never(),
    state: z.never().optional(),
  })
  return {
    Component,
    schema: exercise.generator?.params ? state.or(params) : state,
    mark: exercise.mark,
  }
}

function Feedback<S>(
  props:
    | {
        children: JSXElement
        correct: boolean
        solution?: S
        attempts: true | number
      }
    | { marking: true },
) {
  if ('correct' in props) {
    return (
      <div class="bg-white border rounded-xl p-4 my-4">
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
        <Show when={!props.correct && props.attempts && props.attempts !== true}>
          <p>Tentatives restantes: {props.attempts}</p>
        </Show>
      </div>
    )
  } else {
    return (
      <div class="bg-white border rounded-xl p-4 my-8">
        <p class="text-gray-300 font-bold text-2xl mb-4">
          <Fa icon={faHourglassHalf} /> Correction en cours...
        </p>
      </div>
    )
  }
}
