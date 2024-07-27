import { JSXElement, createEffect } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { type ZodObject } from 'zod'

export type ExerciseProps<S, G> = {
  feedback?: {
    correct: boolean
    valid: boolean
  }
  options?: {
    mark: boolean
    readOnly: boolean
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

  return props.children
}
