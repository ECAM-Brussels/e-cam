import { JSXElement, createEffect } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { type ZodSchema } from 'zod'

export type ExerciseProps<S, G> = {
  feedback?: {
    correct: boolean
  }
  options?: {
    mark: boolean
    readOnly: boolean
  }
  setter: SetStoreFunction<Omit<ExerciseProps<S, G>, 'setter'>>
  state?: S
  params?: G
}

export default function Exercise<S, G>(
  props: ExerciseProps<S, G> & {
    children: JSXElement
    generate?: (params: G) => Promise<S>
    schema: ZodSchema
    mark: (state: S) => Promise<boolean>
  },
) {
  createEffect(async () => {
    if (props.generate && props.params && !props.state) {
      props.setter('state', await props.generate(props.params))
    }
  })

  createEffect(async () => {
    if (props.options?.mark && props.state) {
      try {
        props.schema.parse(props.state)
        props.setter('feedback', {
          correct: await props.mark(props.state),
        })
      } catch {}
    }
  })

  return <>{props.children}</>
}
