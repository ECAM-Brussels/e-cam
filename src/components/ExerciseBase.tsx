import { faCheckCircle, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons'
import { debounce } from 'lodash-es'
import { JSXElement, Show, createEffect, createSignal, on, onCleanup, onMount } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { type ZodObject } from 'zod'
import Fa from '~/components/Fa'
import Spinner from '~/components/Spinner'

export type Feedback<S> = {
  correct?: boolean
  valid?: boolean
  solution?: S
  time?: number
}

type Options = {
  readOnly: boolean
  remainingAttempts: number | boolean
  showSolution?: boolean
}

export type ExerciseProps<S, G> = {
  feedback?: Feedback<S>
  options?: Options
  initialOptions: Options
  onGenerate?: () => void
  onSubmit?: () => void
  onMarked?: () => void
  setter: SetStoreFunction<Omit<ExerciseProps<S, G>, 'setter'>>
  state?: S
  params?: G
}

export default function ExerciseBase<S, G>(
  props: ExerciseProps<S, G> & {
    type: string
    children: JSXElement
    generate?: (params: G) => Promise<S> | S
    schema: ZodObject<any>
    mark: (state: S) => Promise<boolean> | boolean
    solve?: (state: S) => Promise<S> | S
    solution?: JSXElement
  },
) {
  const [marking, setMarking] = createSignal(false)

  createEffect(async () => {
    if (props.generate && props.params && !props.state) {
      props.setter('state', await props.generate(props.params))
      props.setter('params', undefined)
      props.onGenerate?.()
    }
  })

  createEffect(() => {
    if (!props.feedback) {
      props.setter('feedback', {})
    }
  })

  createEffect(() => {
    if (!props.options) {
      props.setter('options', props.initialOptions)
    }
  })

  const mark = debounce(async () => {
    if (props.state) {
      try {
        props.schema.parse(props.state)
        props.setter('feedback', 'valid', true)
        setMarking(true)
        const result = await props.mark(props.state)
        setMarking(false)
        props.setter('feedback', 'correct', result)
        if (result) {
          props.setter('options', 'showSolution', true)
          props.setter('options', 'readOnly', true)
        }
        props.onMarked?.()
      } catch {
        props.setter('feedback', 'valid', false)
        props.setter('feedback', 'correct', false)
      }
    }
  }, 200)

  createEffect(async () => {
    if (props.options?.readOnly && props.feedback?.correct === undefined && !marking()) {
      mark()
    }
  })

  let timer: ReturnType<typeof setInterval>
  onMount(() => {
    timer = setInterval(() => {
      if (!props.feedback?.time) {
        props.setter('feedback', 'time', 0)
      }
      if (props.feedback && props.feedback.correct === undefined) {
        props.setter('feedback', 'time', props.feedback.time! + 1)
      }
    }, 1000)
  })
  onCleanup(() => {
    clearInterval(timer)
  })

  createEffect(async () => {
    if (props.state) {
      if (props.options?.showSolution && props.solve) {
        const solution = await props.solve(props.state)
        props.setter('feedback', 'solution', solution)
      }
    }
  })

  const submit = () => {
    setTimeout(() => {
      setMarking(true)
      mark()
      if (typeof props.options?.remainingAttempts === 'number') {
        props.setter('options', 'remainingAttempts', props.options?.remainingAttempts - 1)
      }
      if (!props.options?.remainingAttempts) {
        props.setter('options', 'showSolution', true)
        props.setter('options', 'readOnly', true)
      }
      props.onSubmit?.()
    })
  }

  return (
    <div class="w-full mb-4">
      <div
        class="bg-white border rounded-s-xl p-4 mb-4"
        onKeyDown={(e) => {
          if (e.code === 'Enter') {
            setTimeout(submit, 300)
          }
        }}
      >
        <Show when={props.state} fallback={<Spinner />}>
          {props.children}
        </Show>
        <Show when={!props.options?.readOnly}>
          <p class="mt-6">
            <Show when={!marking()} fallback={<Spinner />}>
              <button
                class="py-1 px-2 border border-green-800 rounded text-green-800"
                onClick={submit}
              >
                <Fa icon={faPaperPlane} /> Soumettre
              </button>
            </Show>
          </p>
        </Show>
      </div>
      <Show when={props.feedback?.correct !== undefined || props.options?.showSolution}>
        <div class="bg-white border rounded-s-xl p-4">
          <Show when={props.feedback?.correct === true}>
            <p class="text-green-800 font-bold text-xl">
              <Fa icon={faCheckCircle} /> Correct&nbsp;!
            </p>
          </Show>
          <Show when={props.feedback?.correct === false}>
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
