import Fa from './Fa'
import { faCalculator } from '@fortawesome/free-solid-svg-icons'
import { cache } from '@solidjs/router'
import { createResource, createSignal, Show, Suspense } from 'solid-js'
import Math from '~/components/Math'
import Spinner from '~/components/Spinner'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

type CalculatorResponse = {
  symbolic: string
  numeric: string
  isNumeric: boolean
}

const calculate = cache(async (expr: string): Promise<CalculatorResponse> => {
  'use server'
  let response = { symbolic: '', numeric: '', isNumeric: false }
  if (!expr) {
    return response
  }
  try {
    const { expression } = await request(
      graphql(`
        query Calculate($expr: Math!) {
          expression(expr: $expr) {
            simplify {
              expr
            }
            isNumeric
            evalf {
              expr
            }
          }
        }
      `),
      { expr },
    )
    return {
      symbolic: expression.simplify.expr,
      numeric: expression.evalf.expr,
      isNumeric: expression.isNumeric,
    }
  } catch {
    return response
  }
}, 'calculate')

type CalculatorProps = {
  class?: string
  value?: string
}

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
        <div class="text-center my-4">
          <Math value={answer()?.symbolic} />
          <Show when={!answer()?.isNumeric && answer()?.numeric}>
            <Math class="text-xs text-slate-500" value={'\\approx' + answer()?.numeric} />
          </Show>
        </div>
      </Suspense>
    </div>
  )
}
