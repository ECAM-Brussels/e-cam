import { Show, type JSXElement } from 'solid-js'

const environments = {
  definition: ['Définition', 'bg-green-700 text-green-100'],
} as const

type EnvironmentProps = {
  children: JSXElement
  title?: JSXElement
  type: keyof typeof environments
}

export default function Environment(props: EnvironmentProps) {
  return (
    <div class="border rounded-xl shadow">
      <div class={`rounded-t-xl px-3 py-1 ${environments[props.type][1]}`}>
        {environments[props.type][0]}
        <Show when={props.title}>({props.title})</Show>
      </div>
      {props.children}
    </div>
  )
}