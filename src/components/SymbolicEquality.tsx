import Math from './Math'
import Suspense from './Suspense'
import SymbolicRepresentation from './SymbolicRepresentation'
import { createAsync } from '@solidjs/router'
import { createEffect, createSignal } from 'solid-js'
import { simplify } from '~/queries/algebra'

type Props = {
  expr1: string
  expr2: string
}

export default function SymbolicEquality(props: Props) {
  const [expr1, setExpr1] = createSignal('')
  createEffect(() => setExpr1(props.expr1))
  const [expr2, setExpr2] = createSignal('')
  createEffect(() => setExpr2(props.expr2))
  const diff = () => `${expr1()} - (${expr2()})`
  const simplified = createAsync(async () => {
    if (diff()) return simplify(diff())
    return ''
  })

  return (
    <>
      <div class="flex justify-around">
        <SymbolicRepresentation
          class="flex relative z-50 items-center gap-8"
          value={expr1()}
          onChange={setExpr1}
        />
        <SymbolicRepresentation
          class="flex relative z-50 items-center gap-8"
          value={expr2()}
          onChange={setExpr2}
        />
      </div>
      <div class="flex justify-around items-center">
        <div class="border p-8 shadow rounded-xl">
          <h4>
            Différence: <Math value={diff()} />
          </h4>
          <SymbolicRepresentation value={diff()} hideField />
        </div>
        <Math value="\xrightarrow[\text{après simplifications}]{}" displayMode />
        <div class="border p-8 shadow rounded-xl">
          <Suspense>
            <h4>
              Différence après simplification: <Math value={simplified()} />
            </h4>
            <SymbolicRepresentation value={simplified()} hideField />
          </Suspense>
        </div>
      </div>
    </>
  )
}
