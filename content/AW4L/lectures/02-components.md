---
title: Components
slideshow: true
lang: en
---

# Different approaches

- React (JSX, Virtual DOM)

- Solid (JSX, Signals)

- Svelte (SFC)

# Vocabulary

State
: Hello

Effect

# Central idea

::: idea
Minimize the number of developer-facing mutations
:::

# Counter {.grid .grid-cols-2}

```typescript {framework="react"}
function App() {
  const [count, setCount] = useState(0)

  function increaseCount() {
    setCount(count + 1)
  }

  return (
    <button onClick={increaseCount}>
      {count}
    </button>
  )
}
```

::::: col
- You only describe how **state** changes,
  DOM mutations are done for you.

- The return clause is a **description**
  of the DOM that shouldn't change over time.
:::::

# Counter with SolidJS

```typescript {framework="solid"}
function App() {
  const [count, setCount] = createSignal(0)

  function increaseCount() {
    setCount(count() + 1)
  }

  return (
    <button onClick={increaseCount}>
      {count}
    </button>
  )
}
```

# Counter with Svelte {.grid .grid-cols-2}

```svelte {framework="svelte"}
<script>
  let count = $state(0)

  function increaseCount() {
    count += 1
  }
</script>

<button onClick={increaseCount}>
  {count}
</button>
```

::::: col
- A compiler turns the `$state` rune into a signal.
:::::