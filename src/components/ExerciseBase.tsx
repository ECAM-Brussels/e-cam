import { JSXElement, createEffect } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { type ZodObject } from 'zod'

export type ExerciseProps<S, G> = {
  feedback?: {
    correct: boolean
    valid: boolean
    solution: S
  }
  options?: {
    mark: boolean
    readOnly: boolean
    showSolution?: boolean
  }
  setter: SetStoreFunction<Omit<ExerciseProps<S, G>, 'setter'>>
  state?: S
  params?: G
}

export default function ExerciseBase<S, G>(
  props: ExerciseProps<S, G> & {
    type: string
    children: JSXElement
    generate?: (params: G) => Promise<S>
    schema: ZodObject<any>
    mark: (state: S) => Promise<boolean>
    solve?: (state: S) => Promise<S>
  },
) {
  createEffect(async () => {
    if (props.generate && props.params && !props.state) {
      props.setter('state', await props.generate(props.params))
    }
  })

  createEffect(() => {
    if (!props.feedback) {
      props.setter('feedback', {})
    }
  })

  createEffect(async () => {
    if (props.state) {
      try {
        props.schema.parse(props.state)
        props.setter('feedback', 'valid', true)
        if (props.options?.mark) {
          props.setter('feedback', 'correct', await props.mark(props.state))
        }
      } catch {
        props.setter('feedback', 'valid', false)
        if (props.options?.mark) {
          props.setter('feedback', 'correct', false)
        }
      }
    }
  })

  createEffect(async () => {
    if (props.state) {
      if (props.options?.showSolution && props.solve) {
        const solution = await props.solve(props.state)
        props.setter('feedback', 'solution', solution)
      }
    }
  })

  return props.children
}
