---
title: Components
lang: en
slideshow: true
---

# Propless and stateless components {.grid .grid-cols-2}

::::: col
Simply create a file in your `components` folder, such as

### `src/components/Navbar.svelte`

```html
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<style>
 /* Your style here */
</style>
```

To use it,
simply import it

```html
<script>
  import Navbar from './path/to/Navbar.svelte'
</script>

<Navbar />
```
:::::

::::: col
::: exercise
In your layout,
extract your navbar and footer,
and place it in their own components.

Your code will be easier to maintain!
:::
:::::

# Pure components {.grid .grid-cols-2 .gap-8}

::::: col
Imagine that I want to create a `CVLine` component,
which can be used as such:

```html
<CVLine title="Lecturer in Computer Science" employer="ECAM">
  <ul>
    <li>Favourite students: Business analysts</li>
  </ul>
</CVLine>
```

The component code would look like:

```html
<script>
  let { title, employer, children } = $props()
</script>

<div>
  <h3>{title}, {employer}</h3>
  {@render children()}
</div>
```
:::::

::::: col
### Explanations

- On line 2 of the component code,
  we say that the component will have three **props** (attributes):
  `title`, `employer` and `children`.

- `children` is a special prop.
  It represents all the HTML

::: exercise
#. Create a `Card` component that could work like this:

  ```html {.text-sm}
  <Card 
    title="New Blog Post"
    description="This is a short description."
    image="/images/blog1.jpg"
  />
  ```
#. Create a `Button` component that would work like this:

  ```html {.text-sm}
  <Button variant="text">Button with only text</Button>
  <Button variant="outlined">Button with only a border</Button>
  <Button variant="outlined">Button with a background color</Button>
  ```
:::
:::::

# Basic state {.grid .grid-cols-2}

::::: col
```javascript {.run framework=svelte}
<script>
  let count = $state(0)

  function increment() {
    count = count + 1
  }
</script>

<button onclick={increment}>
  Count: {count}
</button>
```
:::::

::::: col
### Explanations

- We declare `count` to be a **state variable** with initial value `0`.

- **State** variables are variables on which the UI depends.
  Change in state should result in changes in the UI.
  As in a simple counter, `count` is displayed on the screen,
  it is a **state** variable.

### Check your understanding

Could you change the example
so that the increment and the initial value can be decided via props?

```html
<Counter initialValue={4} increment={3} />
```
:::::

# Two-way binding and conditional rendering {.grid .grid-cols-2}

::::: col
```javascript {.run framework=svelte}
<script>
  let name = $state('')
  let nameLength = $derived(name.length)
</script>

<label>
  Name: <input bind:value={name} />
</label>

{#if name}
  <p>
    Hello {name},
    you have {nameLength} letters in your name.
  </p>
{:else}
  <p>You need to complete the form above!</p>
{/if}
```
:::::

::::: col
#### Explanations

- `name` is declared as a state variable

- `nameLength` is a **derived** variable.
  It means that it is recalculated every time
  the underlying state changes.

- The input **binds** its value to `name`:
  when `name` changes, the input does as well;
  when the user types, `name` changes accordingly.

::: exercise
Implement basic validation for a registration page.

- Ask the user to enter their email twice,
  and display an error if both emails aren't identical.
  To make your code more readable,
  use *derived variables*.

- Ask the user to enter a password twice.
  Check the password is long enough and identical,
  otherwise show feedback to the user.

- Conditional rendering is done via `{#if ...}` and `{/if}`,
  and optionally with `{:else}`.
:::
:::::

# Loops {.grid .grid-cols-2}

```javascript {.run .text-sm framework=svelte}
<script>
  let newTask = $state('')
  let tasks = $state([])
  let taskCount = $derived(tasks.length)

  function addTask(event) {
    event.preventDefault()
    tasks = [...tasks, newTask]
    newTask = ''
  }
</script>

<form onsubmit={addTask}>
  <label>
    New task: <input bind:value={newTask} />
  </label>
</form>

<ul>
  {#each tasks as task}
    <li>{task}</li>
  {/each}
</ul>

<p>
  You have {taskCount} outstanding task{taskCount > 1 ? 's' : ''}.
</p>
```

::::: col
### Explanations

- `addTask` is a function that handles form submission:

  - We first disable the usual behaviour,
    which triggers a page reload
  - We change `tasks` to include the current task
  - We clear `newTask` to clear the input

- Looping over tasks is done via [each](https://svelte.dev/docs/svelte/each)

::: exercise
You should be able to implement most client-side logic
that doesn't use the server.

Ask us if you need any ideas
on what component to implement.
:::
:::::