import { JSXElement, createEffect } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'

export type ExerciseProps<S, G> = {
  state?: S
  params?: G
  setter: SetStoreFunction<Omit<ExerciseProps<S, G>, 'setter'>>
}

export default function Exercise<S, G>(
  props: ExerciseProps<S, G> & {
    children: JSXElement
    generate?: (params: G) => Promise<S>
  },
) {
  createEffect(async () => {
    if (props.generate && props.params && !props.state) {
      props.setter('state', await props.generate(props.params))
    }
  })
  return <>{props.children}</>
}
