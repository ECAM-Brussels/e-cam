import { createSignal } from 'solid-js'
import Math from '~/components/Math'

export default function LatexEditor() {
  const [value, setValue] = createSignal('')
  return (
    <>
      <Math
        class="border rounded w-full relative z-50"
        value={value()}
        onInput={(e) => setValue(e.target.value)}
        editable
      />
      <pre class="bg-white text-slate-700 z-50 relative">{value()}</pre>
    </>
  )
}
