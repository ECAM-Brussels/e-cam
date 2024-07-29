import { faCheckCircle, faXmark } from '@fortawesome/free-solid-svg-icons'
import { JSXElement, Show, createEffect } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { type ZodObject } from 'zod'
import Fa from '~/components/Fa'

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
    solution?: JSXElement
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

  createEffect(() => {
    if (!props.options) {
      props.setter('options', {
        mark: false,
        readOnly: false,
        showSolution: false,
      })
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

  return (
    <div class="grid grid-flow-col">
      <div class="col-span-2">
        {props.children}
        <Show when={!props.options?.mark}>
          <p class="mt-6">
            <button
              class="py-2 px-3 border border-green-800 rounded"
              onClick={() => {
                props.setter('options', 'mark', true)
                props.setter('options', 'showSolution', true)
                props.setter('options', 'readOnly', true)
              }}
            >
              Soumettre la réponse
            </button>
          </p>
        </Show>
      </div>
      <Show when={props.options?.mark && props.feedback}>
        <div class="border rounded-xl p-4">
          <Show when={props.feedback?.correct}>
            <p class="text-green-800 font-bold text-xl">
              <Fa icon={faCheckCircle} /> Correct&nbsp;!
            </p>
          </Show>
          <Show when={!props.feedback?.correct}>
            <p class="text-red-800 font-bold text-xl">
              <Fa icon={faXmark} /> Pas de chance&nbsp;!
            </p>
          </Show>
          <Show when={props.options?.showSolution}>{props.solution}</Show>
        </div>
      </Show>
    </div>
  )
}
