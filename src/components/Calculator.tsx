import { cache } from '@solidjs/router'
import { createResource, createSignal, Suspense } from 'solid-js'
import Math from '~/components/Math'
import Spinner from '~/components/Spinner'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

type CalculatorProps = {
  class?: string
}

const calculate = cache(async (expr: string): Promise<string> => {
  'use server'
  if (!expr) {
    return ''
  }
  try {
    const { expression } = await request(
      graphql(`
        query Calculate($expr: Math!) {
          expression(expr: $expr) {
            simplify {
              expr
            }
          }
        }
      `),
      { expr },
    )
    return expression.simplify.expr
  } catch {
    return ''
  }
}, 'calculate')

export default function Calculator(props: CalculatorProps) {
  const [prompt, setPrompt] = createSignal('')
  const [answer] = createResource(prompt, calculate)
  return (
    <div class={props.class} classList={{ 'my-8': true }}>
      <Math
        class="border rounded-xl w-full"
        value={prompt()}
        onBlur={(e) => setPrompt(e.target.value)}
        onkeydown={(e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            ;(e.target as HTMLInputElement).blur()
          }
        }}
        editable
      />
      <Suspense fallback={<Spinner />}>
        <Math value={answer()} displayMode />
      </Suspense>
    </div>
  )
}
