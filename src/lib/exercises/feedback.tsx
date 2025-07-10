import { faCheckCircle, faHourglass, faXmark } from '@fortawesome/free-solid-svg-icons'
import { createAsync } from '@solidjs/router'
import { Show, type Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import Fa from '~/components/Fa'
import Suspense from '~/components/Suspense'

export default function Feedback<Q, A, F extends object>(props: {
  attempts: { correct: boolean; attempt: A }[]
  maxAttempts: number | null
  class?: string
  component?: Component<F>
  marking?: boolean
  getFeedback?: (attempts: true | number, question: Q, attempt: A) => Promise<F> | F
  question: Q
}) {
  const attempt = () => props.attempts.at(-1)!.attempt
  const correct = () => props.attempts.at(-1)!.correct
  const remaining = (offset?: number) => {
    if (props.attempts.at(-1)?.correct) {
      return 0
    }
    return props.maxAttempts === null
      ? true
      : props.maxAttempts - props.attempts.length + (offset ?? 0)
  }
  const feedback = createAsync(async () =>
    props.getFeedback?.(remaining(), props.question, attempt()),
  )
  return (
    <div
      class={props.class ?? `m-4 p-2 px-4 rounded-xl border`}
      classList={{ 'bg-green-50': correct(), 'bg-red-50': !correct() }}
    >
      <p class="float-end text-gray-500 mx-4 my-2">
        Tentative {props.attempts.length}
        <Show when={props.maxAttempts !== null}>/{props.maxAttempts}</Show>
      </p>
      <Show
        when={!props.marking}
        fallback={
          <p class="text-gray-300 font-bold text-2xl mb-4">
            <Fa icon={faHourglass} /> Correction en cours...
          </p>
        }
      >
        <details open>
          <Show
            when={correct()}
            fallback={
              <summary class="text-red-800 font-bold text-2xl mb-4">
                <Fa icon={faXmark} /> Réponse inconnecte
              </summary>
            }
          >
            <summary class="text-green-800 font-bold text-2xl mb-4">
              <Fa icon={faCheckCircle} /> Correct&nbsp;!
            </summary>
          </Show>
          <Show when={props.component}>
            {(Component) => (
              <Suspense>
                <Show when={feedback()}>
                  {(feedback) => <Dynamic component={Component()} {...feedback()} />}
                </Show>
              </Suspense>
            )}
          </Show>
        </details>
      </Show>
    </div>
  )
}
