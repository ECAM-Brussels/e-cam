import Spinner from './Spinner'
import { type JSXElement, Suspense } from 'solid-js'

export default function (props: { class?: string; children: JSXElement; fallback?: JSXElement }) {
  return (
    <Suspense
      fallback={
        <div class="flex gap-4 justify-center items-center">
          <Spinner />
          <p>{props.fallback ?? 'Chargement...'}</p>
        </div>
      }
    >
      <div class={props.class}>{props.children}</div>
    </Suspense>
  )
}
