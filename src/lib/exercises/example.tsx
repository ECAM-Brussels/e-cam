import { createExerciseType } from './base'
import { z } from 'zod'

const { Component, schema } = createExerciseType({
  name: 'Factor',
  schema: z.object({
    expr: z.string(),
    attempt: z.string().default(''),
  }),
  mark: (state) => true,
  solve: (state) => state,
  Component: (props) => (
    <>
      <p>Factorise {props.expr}</p>
      <input name="attempt" value={props.attempt} />
    </>
  ),
})

export { Component as default, schema }
