import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Show } from 'solid-js'
import Fa from '~/components/Fa'

export default function Tick(props: { value: boolean | undefined }) {
  return (
    <>
      <Show when={props.value === true}>
        <span class="text-green-700">
          <Fa icon={faCheck} /> Well done!
        </span>
      </Show>
      <Show when={props.value === false}>
        <span class="text-red-700">
          <Fa icon={faXmark} /> Check again.
        </span>
      </Show>
    </>
  )
}
