import { extractFormData } from '../form'
import { hashObject } from '../helpers'
import { action, createAsync, query, useAction, useSubmission } from '@solidjs/router'
import { createContext, createEffect, Show, useContext } from 'solid-js'
import { z } from 'zod'
import Button from '~/components/Button'
import Suspense from '~/components/Suspense'
import ZodError from '~/components/ZodError'
import Feedback from '~/lib/exercises/feedback'
import { optionsSchema, type ExerciseType, type Options } from '~/lib/exercises/schemas'

export type ExerciseProps<Name, Question, Attempt, Params, Feedback> = {
  type: Name
  onChange?: (
    exercise: Omit<
      ExerciseProps<Name, Question, Attempt, Params, Feedback>,
      'onChange' | 'params'
    > & {
      question: Question
    },
    action: 'generate' | 'submit',
  ) => Promise<unknown> | void
  options: Options
  attempts: { correct: boolean; attempt: Attempt }[]
} & ({ question: Question; params: never } | { params: Params; question: never })

const exerciseContextSchema = z.object({
  readOnly: z.boolean().default(false),
})
type ExerciseContextType = z.infer<typeof exerciseContextSchema>
const ExerciseContext = createContext<ExerciseContextType>()
export function useExerciseContext() {
  const context = useContext(ExerciseContext)
  return context ?? null
}

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
  const getQuestion = query(
    async (question: z.infer<Question> | undefined, params: z.infer<G> | undefined) => {
      if (question) return question
      if (!exercise.generator) throw new Error('Exercise does not accept parameters.')
      if (!params) throw new Error('Exercise does not have a question or parameters')
      try {
        const question = await exercise.generator.generate(params)
        const parsed: z.infer<Question> = await exercise.question.parseAsync(question)
        return parsed
      } catch (error) {
        throw new Error(
          `Error while generating exercise ${JSON.stringify(params, null, 2)}: ${error}`,
        )
      }
    },
    `getQuestion-${exercise.name}`,
  )

  function Component(
    props: ExerciseProps<Name, z.infer<Question>, z.infer<Attempt>, z.infer<G>, Feedback>,
  ) {
    const question = createAsync(() => getQuestion(props.question, props.params))
    const save = action(
      async (
        data: Omit<Partial<typeof props>, 'params' | 'onChange'>,
        action: 'generate' | 'submit',
      ) => {
        const { params: _params, onChange, ...current } = props
        return await onChange?.({ ...current, question: question(), ...data }, action)
      },
    )
    const useSave = useAction(save)
    const saving = useSubmission(save)

    createEffect(async () => {
      if (props.params && question() && !saving.pending) {
        await useSave({}, 'generate')
      }
    })

    const getFeedback = exercise.feedback?.[0]
    const ExerciseFeedback = exercise.feedback?.[1] ?? undefined
    const remaining = (offset?: number) => {
      if (props.attempts.at(-1)?.correct) {
        return 0
      }
      return props.options.maxAttempts === null
        ? true
        : props.options.maxAttempts - props.attempts.length + (offset ?? 0)
    }
    const readOnly = () => remaining() === 0 || (props.attempts.at(-1)?.correct ?? false)

    const mark = query(async (question: z.infer<Question>, attempt: z.infer<Attempt>) => {
      try {
        return await exercise.mark(question, attempt)
      } catch {
        return false
      }
    }, `mark-${exercise.name}`)

    const hash = () => hashObject({ type: props.type, question: question() })
    const submit = action(async (form: FormData) => {
      const attempt: z.infer<Attempt> = exercise.attempt.parse(extractFormData(form).attempt)
      const correct = await mark(question(), attempt)
      const attempts =
        props.options.save === 'lastAttempt'
          ? [{ correct, attempt }]
          : [...props.attempts, { correct, attempt }]
      return useSave({ attempts }, 'submit')
    }, `exercise-${hash()}`)
    const submission = useSubmission(submit)

    return (
      <Suspense fallback="Génération d'un exercice...">
        <ExerciseContext.Provider
          value={{
            get readOnly() {
              return readOnly()
            },
          }}
        >
          <pre>Hello {JSON.stringify(readOnly())}</pre>
          <form method="post" action={submit}>
            <fieldset disabled={readOnly()} class="flex items-end gap-8">
              <Show when={question()}>
                <div>
                  <exercise.Component
                    question={question()}
                    attempt={props.attempts.at(-1)?.attempt}
                  />
                </div>
              </Show>
              <Show when={!readOnly() && !submission.pending}>
                <div class="mb-2">
                  <Button type="submit" color="green">
                    Corriger
                  </Button>
                </div>
              </Show>
            </fieldset>
            <ZodError error={submission.error} />
          </form>
          <Show when={props.attempts.length > 0 && question()}>
            <Suspense fallback="Calcul du feedback...">
              <Feedback
                attempts={props.attempts}
                maxAttempts={props.options.maxAttempts}
                getFeedback={getFeedback}
                component={ExerciseFeedback}
                marking={submission.pending}
                question={question()}
              />
            </Suspense>
          </Show>
        </ExerciseContext.Provider>
      </Suspense>
    )
  }
  const schema = z.object({
    type: z.literal(exercise.name),
    options: optionsSchema.partial().optional(),
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
