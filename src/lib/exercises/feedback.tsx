import { faCheckCircle, faHourglass, faXmark } from '@fortawesome/free-solid-svg-icons'
import { createAsync } from '@solidjs/router'
import { Show, type Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import Fa from '~/components/Fa'

export default function Feedback<Q, A, F extends object>(props: {
  attempt: A
  correct: boolean
  class?: string
  component?: Component<F>
  marking?: boolean
  remainingAttempts: true | number
  getFeedback?: (attempts: true | number, question: Q, attempt: A) => Promise<F> | F
  question: Q
}) {
  const feedback = createAsync(async () =>
    props.getFeedback?.(props.remainingAttempts, props.question, props.attempt),
  )
  return (
    <div
      class={props.class ?? `p-2 px-4 rounded-xl border`}
      classList={{ 'bg-green-50': props.correct, 'bg-red-50': !props.correct }}
    >
      <Show
        when={!props.marking}
        fallback={
          <p class="text-gray-300 font-bold text-2xl mb-4">
            <Fa icon={faHourglass} /> Correction en cours...
          </p>
        }
      >
        <Show
          when={props.correct}
          fallback={
            <p class="text-red-800 font-bold text-2xl mb-4">
              <Fa icon={faXmark} /> Pas de chance&nbsp;!
            </p>
          }
        >
          <p class="text-green-800 font-bold text-2xl mb-4">
            <Fa icon={faCheckCircle} /> Correct&nbsp;!
          </p>
        </Show>
        <p>Tentatives restantes: {props.remainingAttempts}</p>
        <Show when={props.component}>
          {(Component) => (
            <Show when={feedback()}>
              {(feedback) => <Dynamic component={Component()} {...feedback()} />}
            </Show>
          )}
        </Show>
      </Show>
    </div>
  )
}
