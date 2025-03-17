import { ErrorBoundary, type JSXElement } from 'solid-js'

export default function (props: { children: JSXElement }) {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div class="rounded-xl border bg-white p-8 shadow">
          <h1 class="font-bold text-3xl mb-8">Something went wrong</h1>
          <p>{error.toString()}</p>
        </div>
      )}
    >
      {props.children}
    </ErrorBoundary>
  )
}
