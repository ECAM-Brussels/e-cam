import { createEffect, createSignal } from 'solid-js'
import { isServer } from 'solid-js/web'

export default function useStorage<T>(key: string | (() => string), defaultValue: T) {
  const keySignal = () => (typeof key === 'string' ? key : key())
  const [data, setData] = createSignal<T>(defaultValue, {
    equals: (prev, next) => JSON.stringify(prev) === JSON.stringify(next),
  })
  createEffect(() => {
    if (!isServer) {
      const stored = localStorage.getItem(keySignal())
      setData(stored ? JSON.parse(stored) : defaultValue)
    }
  })
  createEffect(() => {
    if (!isServer) {
      localStorage.setItem(keySignal(), JSON.stringify(data()))
    }
  })
  return [data, setData]
}
