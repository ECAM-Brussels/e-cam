import Fa from './Fa'
import { faBook, faCircleExclamation, faCogs, faLightbulb, faPen, faQuestionCircle, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { Show, type JSXElement } from 'solid-js'

const environments = {
  definition: ['Définition', 'bg-green-700 text-green-100', faBook],
  example: ['Exemple', 'bg-teal-700 text-teal-100', faPen],
  exercise: ['Exercice', 'bg-teal-700 text-teal-100', faPen],
  hint: ['Indication', 'bg-yellow-200 text-yellow-700', faLightbulb],
  proposition: ['Proposition', 'bg-slate-700 text-slate-100', faBook],
  question: ['Question', 'bg-blue-950 text-blue-50', faQuestionCircle],
  remark: ['Remarque', 'bg-amber-600 text-amber-50', faCircleExclamation],
  solution: ['Solution', 'bg-neutral-100 text-neutral-500', faCogs],
  warning: ['Attention', 'bg-red-800 text-red-50', faTriangleExclamation],
} as const

type EnvironmentProps = {
  children: JSXElement
  class?: string
  title?: JSXElement
  type: keyof typeof environments
}

export default function Environment(props: EnvironmentProps) {
  const env = () => environments[props.type]
  return (
    <div class="border rounded-xl shadow m-8 break-inside-avoid-column">
      <div class={`rounded-t-xl px-4 py-1 font-bold ${env()[1]}`}>
        <Fa icon={env()[2]} /> {env()[0]}{' '}
        <Show when={props.title}>
          <span class="font-thin">({props.title})</span>
        </Show>
      </div>
      <div class={`px-2 ${props.class}`}>{props.children}</div>
    </div>
  )
}
