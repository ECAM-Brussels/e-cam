---
title: Components
slideshow: true
lang: en
---

# Vocabulary {.grid .grid-cols-2}

::::: column
State
: Data owned by a UI piece that can change over time and affects what is shown.

Effect
: Work that runs because the UI or its data changed.

DOM
: The structured representation of the web page (elements such as buttons, text, and panels) that the browser uses to draw the UI.

DOM mutation
: A change to the DOM (for example, changing text, adding or removing elements) — in plain terms, any visible change on the page.
:::::

::::: column
::: exercise
Find example for all of these definitions
:::
:::::

# Vanilla JS {.w-1--2}

::: exercise
- Identify the state, effects and DOM mutations.

- Explain why the code doesn't work
:::

~~~ html {.run runImmediately=true}
<script>
  document.addEventListener("DOMContentLoaded", () => {
    const futureButton = document.getElementById('button')
    futureButton.addEventListener('click', () => {
      let count = Number(futureButton.innerText)
      if (count % 3 == 0 && count % 5 == 0) {
        futureButton.innerText = "fizzbuzz"
      } else if (count % 3 == 0) {
        futureButton.innerText = "fizz"
      } else if (count % 5 == 0) {
        futureButton.innerText = "buzz"
      }
    })
  });
</script>
<!-- --- start -->
<!-- ... -->
<button id="button">0</button>
<script>
  const button = document.getElementById('button')
  let count = 0
  button.onclick = () => {
    count++
    button.innerText = count
  }
</script>
~~~

# Some remarks {.w-1--2}

- Apps are state-driven, JavaScript is event-driven

- Encapsulation is important:
  so far, we had global state, global DOM nodes.

- Code reuse is difficult

- First UI render (HTML) is easy

- Subsequent renders (via DOM mutations) are hard

::: question
Could we write UI in a state-driven, encapsulated way
and which minimizes developer-facing mutations?
:::

# Your first component {.grid .grid-cols-2}

```typescript {framework="react" render="Counter" .run}
import { useState } from 'react'

function Counter() {
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
- This code is **state-driven**

- State is local to the counter

- Code reuse is easy

- You only describe how **state** changes,
  DOM mutations are done for you.

- The return clause is a **description**
  of the DOM that shouldn't change over time.
  We call this **declarative programming**.

- In React, a component is only a function that returns JSX,
  the pseudo-HTML you see in the return clause.
:::::

# How React works {.grid .grid-cols-2}

```typescript {framework="react" render="Counter" .run}
import { useState } from 'react'

function Counter() {
  alert('Rerendering counter')
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

::: column
- Every time **state** changes (in this case when `setCount` is run),
  the function reruns (DDoSing yourself is a thing in React).

- Since working on the DOM is *slow*,
  React works on a copy of the DOM, known as*virtual DOM*,
  and diffs them to apply a smaller change.

  ![](/images/vdom.webp)

- The pseudo HTML in the return clause is called **JSX**.
  It is roughly transpiled to

  ```javascript
  React.createElement(
    'button',
    { onClick: increaseCount },
    count
  )
  ```
:::

# Component reuse {.grid .grid-cols-2}

```typescript {framework="react" .run}
import { useState } from 'react'

type CounterProps = {
  increment: number
  initial: number
}

function Counter({ initial, increment }: CounterProps) {
  const [count, setCount] = useState(initial)
  return (
    <button onClick={() => setCount(count + increment)}>
      {count}
    </button>
  )
}

function App() {
  return (
    <>
      <Counter initial={0} increment={1} />
      <Counter initial={5} increment={3} />
    </>
  )
}

```

::::: col
- Components can have *attributes* or *props*

- Components can be reused in JSX,
  because the latter is simply function calls.

~~~ javascript {.text-sm}
React.createElement(
  React.Fragment,
  null,
  React.createElement(Counter, { initial: 0, increment: 1 }),
  React.createElement(Counter, { initial: 5, increment: 3 })
)
~~~

::: exercise
Read the transpiled code above
and explain why we are using `<></>`
:::

:::::

# The `useEffect` hook {.grid .grid-cols-2}

::::: column
Components completely rerun
every time the state changes
within the component or higher up in the tree.
You may want an escape hatch for this:

```javascript
useEffect(callback, dependencies)
```

`callback` is a function that should be run
every time one of the `dependencies` changes
:::::

::::: column
::: exercise
Change the above code so that the alert only runs once.
:::

```javascript {.run framework="react"}
import { useEffect, useState } from 'react'

function App() {
  const [name, setName] = useState('')
  alert('I run on every name change')
  return (
    <>
      <p>
        Your name:
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </p>
      {name && <p>Hello {name}!</p>}
    </>
  )
}
// ---fragment
import { useEffect, useState } from 'react'

function App() {
  const [name, setName] = useState('')
  useEffect(() => {
    alert('I only run once!')
  }, [])
  return (
    <>
      <p>
        Your name:
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </p>
      {name && <p>Hello {name}!</p>}
    </>
  )
}
```
:::::

# The `useEffect` hook

```javascript {.run framework="react" runImmediately=true .grid .grid-cols-2}
import { useEffect, useState } from 'react'

function App() {
  const [name, setName] = useState('pikachu')
  const [src, setSrc] = useState('')
  const url = 'https://pokeapi.co/api/v2/pokemon/' + name
  useEffect(() => {
    (async function changePokemon() {
      const res = await fetch(url)
      const data = await res.json()
      setSrc(data.sprites.other['official-artwork']['front_default'])
    })()
  }, [name])
  return (
    <>
      <input
        className="block m-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <img src={src} class="w-72 h-72" />
    </>
  )
}
```

# Styling {.w-1--2}

::: question
What about style?
:::

~~~ html {.run runImmediately=true}
<style>
  .hello p {
    color: green !important;
  }
</style>
<!-- --- start -->
<div class="hello">
  <p>This should be red</p>
</div>
<style>
  .hello {
    color: red !important;
  }
</style>
~~~

::: remark
Styling should be locally scoped.
:::

# Tailwind {.grid .grid-cols-2 .gap-8}

```typescript {framework="react" .run runImmediately=true tailwind=true}
function Card({ children }) {
  return (
    <div className="border rounded-xl bg-slate-50 hover:bg-sky-100 w-96 m-auto p-4 shadow">
      {children}
    </div>
  )
}

function App() {
  return <Card>Hello</Card>
}
```

::::: col
- HTML class $\to$ CSS property correspondence

- Modifiers: `hover:`, `dark:`, etc.

- Responsive design: `sm:`, `lg:`, `xl:`

- Style is completely scoped.
  Components can be shared and will look the same.

- There's a tailwind port for React Native!

- Class names are long, but this is not too bad with components.
:::::

# Mobile-first

63% of web traffic is mobile.

<Iframe src="https://tailwindcss.com/" class="w-full h-4/5" />

# Components {.w-1--2}

::: question
Why do we use components for creating user interfaces?
:::

Components are:

- **declarative**

- **reusable**

- **composable**

- **encapsulated**

- **isomorphic**: can be used on the client and on the server

# Components: drawbacks {.w-1--2}

- Global State

  - Shopping cart
    ```tsx {.text-sm}
    <Page>
      <ShoppingCart />
      <Card>
        <p>Item description</p>
        <Button>Buy Item!</Button>
      </Card>
    </Page>
    ```
  - Log out
    ```tsx {.text-sm}
    function LogOutButton() {
      // Must remove user info in whole app!
    }
    ```

- Waterfalls
  ```tsx {.text-sm}
  <ComponentA>
    <ComponentB>
      <ComponentC>
      </ComponentC>
    </ComponentB>
  </ComponentA>
  ```

- Without a meta-framework, SEO is bad.

# React Native

- React for cross platform apps

- HTML tags are replaced by `View`, `Text`, `TextInput`, `Pressable`, `Image`, ...

- Tailwind support through UniWind

# Different approaches {.w-1--2}

- React (JSX, Virtual DOM)
- Solid (JSX, Signals)
- Svelte (SFC, Signals)

::: remark
In our case, we must take the following into account:

- Which of the above can run on the server?
- How is the associated **meta-framework**?
- Which of the above can run on mobile?
:::

# Counter with SolidJS {.grid .grid-cols-2}

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

::::: column
- Components run **once** in SolidJS

- Hooks have a different name:

  - `useState` $\to$ `createSignal`
  - `useEffect` $\to$ `createEffect`

- Reading state happens with **function calls**
  instead of simple variables.
  This is problematic for TypeScript.

- Performance is much better

- DOM updates are surgically applied automatically,
  no need for Virtual DOM.
:::::

# Exercise {.grid .grid-cols-2}

```typescript {framework="solid" .run runImmediately=true}
import { createSignal } from 'solid-js'

function App() {
  const [count, setCount] = createSignal(0)
  setInterval(() => {
    setCount(count() + 1)
  }, 1000)
  return <button>{count()}</button>
}
```

::::: column
::: exercise
Convert the code on the left to React
:::

```typescript {framework="react" .run runImmediately=true}
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  return <button>{count()}</button>
}
```
:::::

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