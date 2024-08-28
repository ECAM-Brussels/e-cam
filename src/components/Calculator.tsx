import Fa from './Fa'
import { faCalculator } from '@fortawesome/free-solid-svg-icons'
import { cache } from '@solidjs/router'
import { createResource, createSignal, Suspense } from 'solid-js'
import Math from '~/components/Math'
import Spinner from '~/components/Spinner'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

type CalculatorProps = {
  class?: string
  value?: string
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
  const [prompt, setPrompt] = createSignal(props.value || '')
  const [answer] = createResource(prompt, calculate)
  return (
    <div class={props.class} classList={{ 'my-8': true }}>
      <div class="flex items-center gap-4 mx-8">
        <button class="border border-sky-800 text-sky-800 px-4 py-1 rounded-xl relative z-20">
          <Fa icon={faCalculator} />
        </button>
        <Math
          class="border rounded-xl w-full relative z-20 shadow px-4 py-2"
          value={prompt()}
          onBlur={(e) => setPrompt(e.target.value)}
          onkeydown={(e: KeyboardEvent) => {
            if (e.key === 'Enter') {
              ;(e.target as HTMLInputElement).blur()
            }
          }}
          editable
        />
      </div>
      <Suspense fallback={<Spinner />}>
        <Math value={answer()} displayMode />
      </Suspense>
    </div>
  )
}
