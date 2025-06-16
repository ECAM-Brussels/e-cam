import Spinner from './Spinner'
import { faCalculator } from '@fortawesome/free-solid-svg-icons'
import { action, useSubmission } from '@solidjs/router'
import { Show } from 'solid-js'
import Fa from '~/components/Fa'
import Math from '~/components/Math'
import Suspense from '~/components/Suspense'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

const calculate = action(async (form: FormData) => {
  'use server'
  const expr = form.get('expr') as string
  let response = { symbolic: '', numeric: '' }
  if (!expr) return response
  try {
    const { expression } = await request(
      graphql(`
        query Calculate($expr: Math!) {
          expression(expr: $expr) {
            simplify {
              expr
            }
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
    }
  } catch {
    return response
  }
}, 'calculate')

export default function Calculator(props: { class?: string; value?: string }) {
  const submission = useSubmission(calculate)
  return (
    <div class={props.class ?? 'my-8 mx-8 relative z-20'}>
      <form class="flex items-center gap-4" method="post" action={calculate}>
        <Show when={!submission.pending} fallback={<Spinner />}>
          <button class="bg-sky-800 text-sky-100 px-4 py-2 rounded-xl" type="submit">
            <Fa icon={faCalculator} />
          </button>
        </Show>
        <Math
          class="border rounded-xl w-full shadow px-4 py-2"
          name="expr"
          editable
          value={(submission.input?.[0].get('name') as string) ?? props.value}
        />
      </form>
      <Suspense>
        <div class="text-center my-4">
          <Math value={submission.result?.symbolic} />
          <Show when={submission.result?.numeric}>
            <Math
              class="text-xs text-slate-500 mx-2"
              value={'\\approx' + submission.result?.numeric}
            />
          </Show>
        </div>
      </Suspense>
    </div>
  )
}
