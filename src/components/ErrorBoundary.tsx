import { ErrorBoundary, type JSXElement } from 'solid-js'

export default function (props: { class?: string; children: JSXElement }) {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div class="rounded-xl border bg-white p-8 shadow">
          <h1 class="font-bold text-3xl mb-8">Something went wrong</h1>
          <details>
            <summary>Error message</summary>
            <pre class="text-sm bg-gray-100 text-gray-700 rounded-xl p-4">{error.toString()}</pre>
          </details>
        </div>
      )}
    >
      <div class={props.class}>{props.children}</div>
    </ErrorBoundary>
  )
}
