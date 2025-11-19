import type { JSX } from 'solid-js'
import z from 'zod/v4'

/**
 * Schema that describes an exercise type
 *
 * - `question`: parameters that make an exercise instance unique
 * - `steps`: view, marker and feedback of a part of the exercise
 * - `params`: parameters to generate questions.
 */
export type Schema<Steps extends string = string> = {
  question: z.ZodObject
  steps: Record<Steps, z.ZodTypeAny>
  params?: z.ZodObject
}

/**
 * Exercise type step, which contains a View and feedback function
 */
type Step<S extends Schema, N extends keyof S['steps'], F> = [
  (
    question: z.infer<S['question']>,
    state: z.infer<S['steps'][N]>,
  ) => Promise<{ correct: boolean; next?: keyof S['steps'] | null; feedback: F }>,
  View: (props: {
    question: z.infer<S['question']>
    state?: z.infer<S['steps'][N]>
    feedback?: F
  }) => JSX.Element,
]

/**
 * Helper to define an exercise step
 *
 * This is in fact a simple identity helper to guide TypeScript inference.
 * More precisely, it checks that the feedback function returns
 */
function defineStep<S extends Schema, N extends keyof S['steps'], F>(
  _schema: S,
  _stepName: N,
  step: Step<S, N, F>,
): Step<S, N, F>
function defineStep<S extends Schema, N extends keyof S['steps'], F>(
  step: Step<S, N, F>,
): Step<S, N, F>
function defineStep(...args: unknown[]) {
  return args.at(-1)
}

/**
 * Exercise type
 * Contains different steps and potentially a generator
 */
export type ExerciseType<S extends Schema = Schema> = {
  steps: { [N in keyof S['steps']]: Step<S, N, any> }
} & (S['params'] extends z.ZodObject
  ? { generator: (params: z.infer<S['params']>) => Promise<z.input<S['question']>> }
  : {})
