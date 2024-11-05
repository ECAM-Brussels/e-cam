import Fa from './Fa'
import { useMeta } from './MetaProvider'
import {
  faBook,
  faCircleExclamation,
  faCogs,
  faLightbulb,
  faPen,
  faQuestionCircle,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { Show, type JSXElement } from 'solid-js'

const environments = {
  definition: ['Definition', 'Définition', 'bg-green-700 text-green-100', faBook],
  example: ['Example', 'Exemple', 'bg-teal-700 text-teal-100', faPen],
  exercise: ['Exercise', 'Exercice', 'bg-teal-700 text-teal-100', faPen],
  hint: ['Hint', 'Indication', 'bg-yellow-200 text-yellow-700', faLightbulb],
  proposition: ['Proposition', 'Proposition', 'bg-slate-700 text-slate-100', faBook],
  question: ['Question', 'Question', 'bg-blue-950 text-blue-50', faQuestionCircle],
  remark: ['Remark', 'Remarque', 'bg-amber-600 text-amber-50', faCircleExclamation],
  solution: ['Solution', 'Solution', 'bg-neutral-100 text-neutral-500', faCogs],
  warning: ['Warning', 'Attention', 'bg-red-800 text-red-50', faTriangleExclamation],
} as const

type EnvironmentProps = {
  children: JSXElement
  class?: string
  title?: JSXElement
  type: keyof typeof environments
}

export default function Environment(props: EnvironmentProps) {
  const env = () => environments[props.type]
  const meta = useMeta()
  const title = () => env()[meta && meta.lang === 'en' ? 0 : 1]
  return (
    <div class="border rounded-xl shadow m-8 break-inside-avoid-column">
      <div class={`rounded-t-xl px-4 py-1 font-bold ${env()[2]}`}>
        <Fa icon={env()[3]} /> {title()}{' '}
        <Show when={props.title}>
          <span class="font-thin">({props.title})</span>
        </Show>
      </div>
      <div class={`px-2 ${props.class}`}>{props.children}</div>
    </div>
  )
}
