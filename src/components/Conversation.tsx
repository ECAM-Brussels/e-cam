import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { For } from 'solid-js'
import Fa from '~/components/Fa'
import Markdown from './Markdown'

type Message = {
  incoming?: boolean
  text: string
}

type Props = {
  recipient: string
  messages: Message[]
}

function Message(props: Message) {
  return (
    <div class="flex items-center m-2" classList={{ 'flex-row-reverse': !props.incoming }}>
      <div
        class="rounded-xl inline-block px-3 py-2 text-sm max-w-[70%]"
        classList={{
          'bg-teal-700': !props.incoming,
          'bg-zinc-100': props.incoming,
          'text-white': !props.incoming,
          'text-zinc-800': props.incoming,
        }}
      >
        <Markdown value={props.text} noprose class="" />
      </div>
    </div>
  )
}

export default function Conversation(props: Props) {
  return (
    <div class="border border-zinc-200 w-96 not-prose">
      <div class="text-center font-semibold bg-zinc-50 text-slate-700 border-b border-zinc-200 py-2">
        {props.recipient}
      </div>
      <div class="h-[36rem] overflow-y-auto">
        <For each={props.messages}>{(message) => <Message text={message.text} incoming={message.incoming} />}</For>
      </div>
      <div class="bg-zinc-50 flex py-2 px-4 gap-4 items-center border-t border-zinc-200">
        <input class="border rounded grow z-20" />
        <Fa icon={faPaperPlane} class="grow-0 text-zinc-500" />
      </div>
    </div>
  )
}
