import { extractFormData } from '../form'
import { createAsync } from '@solidjs/router'
import { Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { z } from 'zod'
import Button from '~/components/Button'
import Whiteboard from '~/components/Whiteboard'
import ZodError from '~/components/ZodError'
import Feedback from '~/lib/exercises/feedback'
import { optionsSchema, type ExerciseType, type OptionsWithDefault } from '~/lib/exercises/schemas'

export type ExerciseProps<Name, Question, Attempt, Params, Feedback> = {
  type: Name
  onChange?: (
    exercise: Omit<
      ExerciseProps<Name, Question, Attempt, Params, Feedback>,
      'onChange' | 'params'
    > & {
      question: Question
    },
  ) => Promise<void> | void
  options: OptionsWithDefault
  attempts: { correct: boolean; attempt: Attempt; feedback?: Feedback }[]
} & ({ question: Question } | { params: Params })

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
  Question extends z.ZodTypeAny,
  Attempt extends z.ZodTypeAny,
  G extends z.ZodTypeAny,
  Feedback extends object,
>(exercise: ExerciseType<Name, Question, Attempt, G, Feedback>) {
  function Component(
    props: ExerciseProps<Name, z.infer<Question>, z.infer<Attempt>, z.infer<G>, Feedback>,
  ) {
    const question = createAsync(async () => {
      if ('question' in props) return props.question
      if (!exercise.generator) throw new Error('Exercise does not accept params.')
      const { params, onChange, ...data } = props
      try {
        const question = await exercise.generator.generate(params)
        await onChange?.({ ...data, question: await exercise.question.parseAsync(question) })
        return question
      } catch (error) {
        throw new Error(
          `Error while generating exercise ${JSON.stringify(params, null, 2)}: ${error}`,
        )
      }
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

    async function mark(question: z.infer<Question>, attempt: z.infer<Attempt>) {
      try {
        return await exercise.mark(question, attempt)
      } catch {
        return false
      }
    }

    async function handleSubmit(event: SubmitEvent) {
      event.preventDefault()
      setSubmission('pending', true)
      setSubmission('error', undefined)
      try {
        const attempt: z.infer<Attempt> = await exercise.attempt.parseAsync(
          extractFormData(new FormData(event.target as HTMLFormElement)).attempt,
        )
        const [correct, feedback] = await Promise.all([
          mark(question(), attempt),
          getFeedback?.(remaining(-1), question(), attempt),
        ])
        const { onChange, ...data } = props
        await onChange?.({
          ...data,
          question: question(),
          attempts: [...props.attempts, { correct, attempt, feedback }],
        })
        setSubmission('pending', false)
      } catch (error) {
        if (error instanceof z.ZodError) {
          setSubmission('error', error)
        }
        setSubmission('pending', false)
      }
    }

    return (
      <Show when={question()} fallback={<p>Generating...</p>}>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={readOnly()} class="p-4 border-b shadow-sm">
            <exercise.Component question={question()} attempt={props.attempts.at(-1)?.attempt} />
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
        <Whiteboard width={800} height={600} toolbarPosition="bottom" />
        <Feedback
          class="border-t p-4"
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
    options: optionsSchema,
    attempts: z
      .object({
        correct: z.boolean(),
        attempt: exercise.attempt,
        feedback: z.any(),
      })
      .array()
      .default([]),
    question: exercise.question.optional().describe('Object containing the exercise information'),
    params:
      exercise.generator?.params.optional().describe('Parameters to generate an exercise') ??
      z.undefined(),
  })
  return { Component, schema, mark: exercise.mark }
}
