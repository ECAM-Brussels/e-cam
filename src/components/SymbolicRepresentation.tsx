import Code from './Code'
import Dot from './Dot'
import Math from './Math'
import { ComputeEngine, MathJsonExpression } from '@cortex-js/compute-engine'
import { createEffect, createSignal, Show } from 'solid-js'

const ce = new ComputeEngine()

function mathjsonToDot(expr: MathJsonExpression) {
  let nodeId = 0
  const nodes: string[] = []
  const edges: string[] = []
  function walk(node: MathJsonExpression, parentId: string | null = null) {
    const currentId = `n${nodeId++}`
    if (Array.isArray(node)) {
      const operator = node[0]
      nodes.push(`${currentId} [label="${operator}"]`)
      if (parentId !== null) {
        edges.push(`${parentId} -> ${currentId}`)
      }
      for (let i = 1; i < node.length; i++) {
        walk(node[i]!, currentId)
      }
    } else {
      nodes.push(`${currentId} [label="${node}"]`)
      if (parentId !== null) {
        edges.push(`${parentId} -> ${currentId}`)
      }
    }
    return currentId
  }
  walk(expr)
  return `
    digraph MathAST {
      node [shape=box];
      ${nodes.join('\n')}
      ${edges.join('\n')}
    }`
}

type Props = {
  class?: string
  hideField?: boolean
  showJson?: boolean
  value?: string
  onChange?: (newValue: string) => void
}

export default function SymbolicRepresentation(props: Props) {
  const [value, setValue] = createSignal(props.value ?? '')
  createEffect(() => setValue(props.value ?? ''))
  const json = () => ce.parse(value()).json
  createEffect(() => {
    props.onChange?.(value())
  })
  return (
    <div class={props.class ?? 'relative z-50'}>
      <Show when={!props.hideField}>
        <Math value={value()} onInput={(e) => setValue(e.target.value)} editable />
      </Show>
      <Show when={json()}>
        <Dot value={mathjsonToDot(json())} />
      </Show>
      <Show when={props.showJson}>
        <Code value={JSON.stringify(json(), null, 2)} lang="json" />
      </Show>
    </div>
  )
}
