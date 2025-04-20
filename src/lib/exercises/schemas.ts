import { type JSXElement } from 'solid-js'
import { z } from 'zod'

export const optionsSchema = z
  .object({
    maxAttempts: z.null().or(z.number()).optional(),
    note: z.string().optional(),
    whiteboard: z.boolean().optional(),
    streak: z.number().optional(),
  })
  .default({})

export const optionsSchemaWithDefault = z
  .object({
    maxAttempts: z.null().or(z.number()).default(1),
    note: z.string().default(''),
    whiteboard: z.boolean().default(true),
    streak: z.number().default(0),
  })
  .default({})

export type Options = z.infer<typeof optionsSchema>
export type OptionsWithDefault = z.infer<typeof optionsSchemaWithDefault>

/**
 * Type used to describe how exercises types are created.
 * This type does not need to be exported,
 * as it should be inferred via the `createExerciseType` function.
 */
export type ExerciseType<
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
