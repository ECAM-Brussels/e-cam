import { faCheckCircle, faHourglass, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Show, type Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import Fa from '~/components/Fa'

export default function Feedback<S, F extends object>(props: {
  attempts: { correct: boolean; state: S; feedback?: F }[]
  component?: Component<F>
  marking?: boolean
  maxAttempts: null | number
}) {
  const lastAttempt = () => props.attempts.at(-1)
  const correct = () => lastAttempt()?.correct
  const remaining = () =>
    props.maxAttempts === null ? true : props.maxAttempts - props.attempts.length
  return (
    <Show when={props.attempts.length || props.marking}>
      <div class="bg-white border rounded-xl p-4 my-4">
        <Show
          when={!props.marking}
          fallback={
            <p class="text-gray-300 font-bold text-2xl mb-4">
              <Fa icon={faHourglass} /> Correction en cours...
            </p>
          }
        >
          <Show
            when={correct()}
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
          <p>Tentatives restantes: {remaining()}</p>
          <Show when={props.component}>
            {(Component) => (
              <Show when={lastAttempt()?.feedback}>
                {(feedback) => <Dynamic component={Component()} {...feedback()} />}
              </Show>
            )}
          </Show>
        </Show>
      </div>
    </Show>
  )
}
