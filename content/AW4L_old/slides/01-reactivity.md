---
title: Reactivity
slideshow: true
lang: en
---

# Project {.columns-2}

::: {.break-inside-avoid .border .rounded-xl .p-4 .shadow-md}
### Instructions

- Individual project, will be used for Mobile Apps
- Sufficiently interactive
- Authentication
:::

::: {.break-inside-avoid .border .rounded .p-4 .shadow-md}
### Technical constraints

- Fully type-safe, including client-server communications
- Data validation
- Should work fully without JavaScript
- Server-Side Rendering
- Client-Side Routing
- Accessible
- Responsive
- Single-Flight mutations
- Optimistic updates
:::

# Install Node.js {.grid .grid-cols-2 .gap-12}

<Iframe src="https://nodejs.org/en" class="w-full h-full border rounded-xl shadow-xl" />

::: col
### Instructions

- Go to <https://nodejs.org/>
- Download Node.js (LTS version)

:::: info
Node.js is a JavaScript interpreter.
It allows your computer to understand and run JavaScript (outside of the browser).
::::
:::

# Solid JS {.grid .grid-cols-2 .gap-12}

::::: col
To install

``` bash
cd Documents/ECAM/4MIN/web-architecture
npx degit solidjs/templates/ts-tailwindcss my-first-solid-project
```

Then, open `my-first-solid-project` with Visual Code.

- [Tutorial](https://www.solidjs.com/tutorial/introduction_basics)
- [SolidJS in 100 seconds](https://www.youtube.com/watch?v=hw3Bx5vxKl0)

::: info
If you'd like to try React: `npm create vite@latest`
:::

::: warning
Neither the SolidJS nor the React project that we are creating now
are enough for the final project's requirements.
:::
:::::

::::: col
::: question
Why SolidJS?
:::

- Modern
- Syntaxically similar to React
- Easier to explain how it works (no virtual DOM, automatic dependency tracking)
- Primitive based, allows for incremental approach

::: question
What if I want to use something else?
:::

- [React + Next](https://nextjs.org)
- [React + TanStack Start](https://tanstack.com/start/latest) (beta)
- [Svelte + SvelteKit](https://svelte.dev)
- [Qwik + Qwikcity](https://qwik.dev/docs/qwikcity/)
- [Angular + Analog](https://analogjs.org/)
:::::

# TypeScript {.w-2--3}

<Iframe src="https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html" class="w-full h-full border rounded-xl shadow" />

# Signals {.columns-2}

::::: break-inside-avoid
::: {.definition title="Signal"}
A **signal** is a piece of reactive data,
which when changed,
triggers updates to any parts of your application that depends on it.
:::

::: {.border .rounded-xl .shadow .mx-8 .px-8}
A useful analogy is that of an Excel document.
Changing a cell retriggers calculations,
like below

```javascript {.run framework="solid" hideEditor=true runImmediately=true}
import { createSignal } from 'solid-js'

function App() {
  const [cell1, setCell1] = createSignal(13)
  const [cell2, setCell2] = createSignal(17)
  const average = () => (parseInt(cell1()) + parseInt(cell2())) * 5 / 2
  return (
    <table>
      <thead>
        <tr>
          <th>Web (20)</th>
          <th>Mobile</th>
          <th>Average</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input type="number" value={cell1()} onInput={e => setCell1(e.target.value)} />
          </td>
          <td>
            <input type="number" value={cell2()} onInput={e => setCell2(e.target.value)} />
          </td>
          <td>{average()} %</td>
        </tr>
      </tbody>
    </table>
  )
}
```

The two input fields use a **signal** under the hood,
while the average is a **derived value** from those signals.
When a signal changes,
so does its derived values.
:::
:::::

::::: break-inside-avoid
In SolidJS, signals are created via **createSignal**,
which returns an array of two elements:
a getter and a setter.

$$
\mathtt{const}\, [
\underbrace{\mathtt{value}}_{\text{getter}},\
\underbrace{\mathtt{setValue}}_{\text{setter}}
] = \mathtt{createSignal}
\underbrace{\mathtt{<number>}}_{\text{type hint}}
(\underbrace{\mathtt{'hello'}}_{\text{initial value}})
$$

The type annotation is often not necessary
and can be inferred by TypeScript.

::: example
```javascript {.run}
import { createSignal } from 'solid-js'

const [count, setCount] = createSignal(0)
for (let i = 1; i <= 5; i++) {
  setCount(i)
  console.log('Count is now', count())
}
```
:::
:::::

# Derived state {.columns-2}

::::: break-inside-avoid
::: definition
A **derived value** is a value which is purely calculated from at least one signals.
When a dependent signal change,
the derived value should be recalculated.
:::

As SolidJS signals are functions,
a **derived value** in SolidJS is simply a function
which returns a value directly calculated from a signal.
:::::

::::: break-inside-avoid
```javascript {.run}
import { createSignal } from 'solid-js'

// Signal
const [count, setCount] = createSignal(0)

// Derived
function doubleCount() {
  return count() * 2
}

// Derived (arrow syntax)
const tripleCount = () => count() * 3

// Check they are kept in sync
console.log(count(), doubleCount(), tripleCount())
setCount(5)
console.log(count(), doubleCount(), tripleCount())
```
:::::

# Effects {.grid .grid-cols-2}

::: col
::::: definition
An **effect** is a function that runs whenever its dependent signals change.
:::::

::::: {.grid .grid-cols-2}
:::: col
Effects are used

- To fetch data
- To update the DOM
- To trigger animations
- ...
::::

```javascript {.run framework="solid" hideEditor=true runImmediately=true}
import { createSignal, createResource, Show } from 'solid-js'

async function loadPokemonImage(name) {
  const url = 'https://pokeapi.co/api/v2/pokemon/'
  try {
    const res = await fetch(url + name)
    const data = await res.json()
    return data.sprites.other['official-artwork']['front_default']
  } catch {
    return ''
  }
}

function App() {
  const [name, setName] = createSignal('pikachu')
  const [src] = createResource(name, loadPokemonImage)
  return (
    <>
      <p><input value={name()} onInput={e => setName(e.target.value)} /></p>
      <Show when={src()} fallback="Loading..."><img src={src()} width={200} /></Show>
    </>
  )
}
```
:::::

In the Pokemon example,
effects are used

- to synchronise the input value with state value
- to fetch the image and update the DOM every time the Pokemon name changes
:::

::: col
### In SolidJS

`createEffect(fn)` executes `fn` and re-executes it every time
one of the inner signals changes.

```typescript {.run}
import { createEffect, createSignal } from 'solid-js'

const [count, setCount] = createSignal(0)

createEffect(() => {
  // Since this effect contains count(),
  // It will be re-executed every time setCount is called
  console.log('Count is now', count())
})

for (let i = 1; i <= 5; i++) {
  setCount(i)
}
```
:::

# JSX

JSX is a syntax extension to JavaScript
that allows DOM manipulation in a syntax resembling HTML.

- Signals and derived values are automatically updated (via effects)

::::: {.grid .grid-cols-2}
``` javascript
const title = <h1>hello {name()}</h1>
```

```javascript
const title = document.createElement('h1')
createEffect(() => title.textContent = 'hello ' + name())
```
:::::

- Unknown tags become function calls

::::: {.grid .grid-cols-2}
```javascript
<Sidebar prop={value} otherProp={otherValue} />
```

```javascript
Sidebar({ prop: value, otherProp: otherValue })
```
:::::

- Children are passed as attributes

::::: {.grid .grid-cols-2}
```javascript
<Parent parentProp={parentVal}>
  <Child prop={value} />
  <OtherChild />
</Parent>
```
```javascript
Parent({
  parentProp: parentVal,
  children: [Child({ prop: value }), OtherChild]
})
```
:::::

# JSX in practice: differences with HTML

- **Close all tags**:
  use a slash at the end of self-contained tags such as `<img />`.

- **One root element**:
  if you need multiple tags,
  you can wrap them into a *fragment* `<></>`:

::::: {.grid .grid-cols-2}
```javascript
<>
  <Child prop={value} />
  <OtherChild />
</>
```
```javascript
Fragment({
  children: [Child({ prop: value }), OtherChild]
})
```
:::::

- **Use curly braces** for JavaScript expressions
  and **camel case** for attributes,
  e.g. `<input value={name()} onInput={e => setName(e.target.value)} />`

# Components and props {.w-2--3}

::: {.definition title="Component"}
A **component** is a function which takes an object as parameter and which returns JSX.
The properties of the parameter are called **props**.
:::

```typescript {.run framework="solid"}
import { createSignal } from 'solid-js'

type Props = {
  initialValue: number
  increment: number
}

function Counter(props: Props) {
  const [count, setCount] = createSignal(props.initialValue)
  const increase = () => setCount(count() + props.increment)
  return (
    <button onClick={increase}>{count()}</button>
  )
}

const App = () => <Counter initialValue={7} increment={2} />
```

# Children: example

```typescript {.run framework="solid" .grid .grid-cols-2 .gap-12}
import type { JSX } from "solid-js"

type CVLineProps = {
  date: string
  school: string
  title: string
  children: JSXElement
}

const CVLine = (props: CVLineProps) => (
  <div>
    <h3>{props.title} ({props.school}, {props.date})</h3>
    {props.children}
  </div>
)

const App = () => (
  <CVLine date="2023-2025" school="ECAM" title="MEng in Industrial Engineering">
    <ul>
      <li>Grade: <em>cum laude</em></li>
      <li>Favourite class: Web Architecture</li>
    </ul>
  </CVLine>
)
```

# Conditional rendering

```typescript {framework="solid" .run .grid .grid-cols-2 .gap-12}
import { createSignal, Show } from 'solid-js'

function App() {
  const [name, setName] = createSignal('')
  return (
    <>
      <p>What is your name?</p>
      <input value={name()} onInput={e => setName(e.target.value)} />
      <Show when={name()} fallback={<p>No name supplied</p>}>
        <p>Hi {name()}!</p>
      </Show>
    </>
  )
}
```

# Loops

```typescript {framework="solid" .run .grid .grid-cols-2 .gap-12}
import { createSignal, For } from 'solid-js'

function App() {
  const [task, setTask] = createSignal('')
  const [tasks, setTasks] = createSignal<string[]>([])
  function addTask() {
    setTasks([...tasks(), task()])
    setTask('')
  }
  return (
    <>
      <input value={task()} onInput={e => setTask(e.target.value)} />
      <button onClick={addTask}>Submit</button>
      <ul>
        <For each={tasks()}>
          {task => <li>{task}</li>}
        </For>
      </ul>
    </>
  )
}
```

# Documentation

### SolidJS

- [SolidJS tutorial](https://www.solidjs.com/tutorial/introduction_basics)
- [Documentation](https://docs.solidjs.com/)

### React

- [React tutorial](https://react.dev/learn/tutorial-tic-tac-toe)
- [React documentation](https://react.dev/reference/react)

# Styling

When you set up SolidJS,
you also installed **tailwindcss**.


```javascript {.run framework="solid" .grid .grid-cols-2 .gap-12 tailwind=true}
const App = () => (
  <p class="border rounded-xl p-4 shadow-lg hover:bg-slate-100">
    Hello!
  </p>
)
```

- [Official website](https://tailwindcss.com/)
- [Documentation](https://tailwindcss.com/docs/styling-with-utility-classes)
- [Intro to Tailwind in 100 seconds](https://www.youtube.com/watch?v=mr15Xzb1Ook)

# Exercises {.columns-2}

::: exercise
Implement a simple registration form with client-side validation

- Check the email is valid
- Check the password is complex enough
  and both passwords are the same.

Give instant feedback to the user.
:::

::: exercise
Implement a tic-tac-toe with the following requirements.

- At least two components: `Square`, `Board`
- Type safe
- If bored: History of all the moves
:::

::: exercise
Implement a Minesweeper clone.
:::

# React: comparison {.grid .grid-cols-2}

::: col
SolidJS's syntax is heavily inspired from that of React.

- `createSignal` becomes `useState`

- `createEffect` becomes `useEffect`

- Conditions are done via the `&&` and the ternary operator:

  ```javascript
  {age > 18 && <p>You are an adult</p>}
  ```

- Loops are done via `.map` instead of `<For />`

- Dependencies must be explicitly stated in React.
  Effects cannot be marked with `async` in React.

  ```javascript
  useEffect(() => {
    console.log('name is now', name)
  }, [name]) // Specify that it will rerun when name changes
  ```
:::

::: col
~~~ javascript {.run framework="react"}
import { useState } from 'react'

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])
  const handleSubmit = (event) => {
    event.preventDefault()
    setTask('')
    setTasks([...tasks, task])
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        New task:
        <input value={task} onInput={(e) => setTask(e.target.value)} />
      </label>
      <ul>
        {tasks.map(task => <li>{task}</li>)}
      </ul>
    </form>
  )
}
~~~
:::

# Solid vs React {.grid .grid-cols-2}

```typescript {.run framework="solid"}
import { createSignal } from 'solid-js'

function App() {
  const [count, setCount] = createSignal(0)
  const increase = () => setCount(count() + 1)

  console.log('Executing App...')

  return <button onClick={increase}>{count()}</button>
}
```

```typescript {.run framework="react"}
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  const increase = () => setCount(count + 1)

  console.log('Executing App...')

  return <button onClick={increase}>{count}</button>
}
```

# JavaScript frameworks {.w-1--2}

::: question
What are the benefits and drawbacks of using JavaScript frameworks
for designing User Interfaces?
:::

Because it **scales extremely well**.

- Declarative approach

- Encapsulation

- Reusability

- Testability

- Easier to debug: unidirectional data flow, read/write segregation

::: warning
This is an exam question.
:::

# Implementing SolidJS: Key Idea {.w-1--2}

```typescript
createEffect(function effect() {
  console.log(signal(), 'has changed')
})
```

```dot {.run hideEditor=true}
digraph {
  rankdir = "LR"
  setSignal -> effect
  effect -> signal
}
```

#. `signal()` bust be aware that it is inside `effect`,
   and keep a list of subscribed effects.

#. When calling `setSignal`,
   we need to rerun all the subscribed effects.

# Implementing `createEffect` {.grid .grid-cols-2}

```typescript
const running = []

function createEffect(effect) {
  function wrappedEffect() {
    running.push(wrappedEffect)
    effect()
    running.pop()
  }
  wrappedEffect()
}
```

::: col
- We keep a LIFO stack of running effects (i.e. `running`).
  To know which effect is currently running,
  we can check the element at the top of the stack,
  i.e. `running[running.length - 1]`.

- When creating an effect,
  we change it so that it pushes itself on and off the stack.
:::

# Implementing `createSignal` {.grid .grid-cols-2}

```typescript
function createSignal(value) {
  const subscribers = new Set()
  function getter() {
    if (running) {
      subscribers.add(running[running.length - 1])
    }
    return value
  }
  function setter(newValue) {
    value = newValue
    subscribers.map(effect => effect())
  }
  return [getter, setter]
}
```

::: col
- `createSignal` must return a getter and a setter,
  which will get or set `value`.

- The getter will check if it's running inside an effect.
  If so, it will add it to its subscribers.

  ```typescript
  createEffect(function effect() {
    console.log(signal(), 'has changed')
  })
  ```

  In the example above,
  when `signal()` is executed,
  it is aware of effect
  and adds it to its subscribers.

- When the setter is called,
  it runs all the subscribed effects.
:::

# Comparison with React {.w-1--2}

::: question
How does React work?
:::

- Components are **fully re-executed** at each state change.

- To avoid costly operations,
  React works with a **Virtual DOM**.
  A diffing algorithm is then used to update the actual DOM.

# Prop drilling {.w-1--2}

Data flows from parent to child via props.

```javascript
function App() {
  // Passing a prop named "name" from App to MyComponent
  return (
    <div>
      <MyComponent name="NGY" />
    </div>
  );
}
```

::: question
How to pass state from a component to grand-grand children?
:::

For example,
properties such as the *theme* or *language* are useful to the whole component tree.

# Context {.grid .grid-cols-2}

::::: col
### Providing context

```typescript
import { createContext } from 'solid-js';

const Context = createContext<{ lang: string }>({ lang: 'en' })

function App() {
  return (
    <Context.Provider value={{ lang: 'en' }}>
      <Child />
      <Child />
    </Context.Provider>
  )
}
```
:::::

::::: col
### Consuming context

```typescript
import { useContext } from 'solid-js'
import { Context } from './App.tsx'

function GrandChild() {
  const userPreferences = useContext(Context)
  return (
    <p>Language: {userPreferences().lang}</p>
  )
}
```

::: info
More info:

- SolidJS: [Context documentation](https://docs.solidjs.com/concepts/context)
- React: [createContext](https://react.dev/reference/react/createContext)

Note that the syntax is identical in React.
:::
:::::

# Basic data fetching {.grid .grid-cols-2}

::::: col
Fetching data could be done directly via `fetch`,
often inside an effect.

```typescript {.run framework="solid"}
import { createSignal, For } from 'solid-js'

type Pokemon = { name: string; url: string }

function App() {
  const [pokemons, setPokemons] = createSignal<Pokemon[]>([])
  async function fetchPokemons() {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=6&offset=0')
    const pokemons = (await res.json()).results as Pokemon[]
    setPokemons(pokemons)
  }
  fetchPokemons()
  return (
    <For each={pokemons()}>
      {pokemon => <li>{pokemon.name}</li>}
    </For>
  )
}
```
:::::

::::: col
- Civilized people use `try/catch` in `fetchPokemons`

- `await` means that the main thread pauses the execution of the function
  until the promise has completed,
  and returns the result of said promise.

- In React, line 11 must be replaced by
  ```typescript
  useEffect(() => {
    fetchPokemons()
  }, [])
  ```
  otherwise it is continuously executed.
  React re-executes the function entirely at each state change.

- Should be done:

  - Spinner when loading
  - Handle errors on the UI
:::::

# Fetching with signals {.grid .grid-cols-2}

::::: col
If what we fetch depends on a signal, we can use `createEffect`:

```typescript {.run framework="solid"}
import { createEffect, createSignal } from 'solid-js'

function App() {
  const [name, setName] = createSignal('pikachu')
  const [json, setJson] = createSignal('')
  createEffect(async () => {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + name())
    const data = await res.json()
    setJson(JSON.stringify(data, null, 2).substring(0, 150))
  })
  return (
    <>
      <input value={name()} onInput={e => setName(e.target.value)} />
      <pre>{json()}</pre>
    </>
  )
}
```
:::::

::::: col
- Subject to race conditions.
  If you type 'mewtwo', you might end up with 'mew'!

- In React, the effect cannot be marked with `async`,
  and the dependencies needs to be explicitely stated:

  ```typescript
  createEffect(() => {
    async function fetchPokemon() {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + name)
      const data = await res.json()
      setJson(JSON.stringify(data, null, 2).substring(0, 150))
    }

    fetchPokemon()
  }, [name])
  ```
:::::

# Better data fetching {.grid .grid-cols-5}

::::: col-span-3
It is better to use `createResource`:

```typescript {.run framework="solid"}
import { createSignal, createResource, ErrorBoundary, Suspense, resetErrorBoundaries } from 'solid-js'

function App() {
  const [name, setName] = createSignal('pikachu')
  const [json] = createResource(name, async (name) => {
    resetErrorBoundaries()
    const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + name)
    const data = await res.json()
    return JSON.stringify(data, null, 2).substring(0, 150)
  })
  return (
    <>
      <input value={name()} onInput={e => setName(e.target.value)} />
      <ErrorBoundary fallback={err => <p>Error when loading {name()}</p>}>
        <Suspense fallback={<p>Loading {name()}...</p>}>
          <pre>{json()}</pre>
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
```
:::::

::::: col-span-2
- `const [data] = createResource(source, fetcher)`{.javascript} calls `fetcher`
  every time the `source` signal changes,
  and `data` is a signal.
  The value of `source` is supplied as a parameter to the fetcher.

- The `Suspense` component tracks all resources under it
  and shows a fallback placeholder until they are resolved.

- The `ErrorBoundary` component renders fallback content
  if an error is uncaught.

- For `React` and `React Native`,
  use `tanstack-query`.
:::::

# Exercise: Pokedex {.w-2--3}

::: exercise
Use the [PokeAPI](https://pokeapi.co/) to create a pokédex.
Structure it as such:

```typescript
function App() {
  const [name, setName] = createSignal('pikachu')
  return (
    <>
      <Sidebar name={name()} onNameChange={setName} />
      <Pokemon name={name()} />
    </>
  )
}
```

- `Sidebar` must contain a list of all the Pokemon,
  and clicking it must load the pokedex page of that Pokemon.
  It must have a search bar at the top.

- `Pokemon` must show at least a picture,
  the base stats, the moves it can learn, the type,
  and you should be able to play its cry.
:::
