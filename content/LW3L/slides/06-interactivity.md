---
title: Interactivity
slideshow: true
lang: en
---

# DOM API {.w-1--2}

::: {.definition title="DOM"}
The DOM is the representation of a web page in the working memory of the browser.
:::

A web page is represented as a tree.

![](https://upload.wikimedia.org/wikipedia/commons/5/5a/DOM-model.svg){.w-1--2 .mx-auto}

# Counter: DOM API {.grid .grid-cols-2}

~~~ html {.run}
<button id="counter">0</button>

<script>
  let count = 0
  const button = document.getElementById('counter')
  button.onclick = () => {
    count++
    button.innerText = count
  }
</script>
~~~

::: col
- There's a huge syntax difference between
  how the first render is written (HTML)
  and how subsequent changes are applied (DOM API).

- The DOM API is **global**.
  When we select the button (line 5),
  we cannot guarantee that this button will not be removed by another part of the code.

- The `onclick` event handler does two things:
  change the **state** (here `count`, line 7)
  and **mutate the DOM** (line 8).
:::

# Counter: with React {.grid .grid-cols-2 .gap-4}

~~~ tsx {.run framework='react' render='Counter'}
'use client'

import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => {
      setCount(count + 1)
    }}>
      {count}
    </button>
  )
}
~~~

::: col
- `'use client'` is to tell Next that the JavaScript in the component
  will be used not only for SSR,
  but also for **client interactivity**.

- `const [count, setCount] = useState(0)` means that `count` is a **state variable**,

- We are using the same syntax
  for the first but also the subsequent renderings of the page.

- We only handle state changes,
  mutations are left to React.
:::

# Example: form validation {.w-1--2}

~~~ tsx {.run framework='react' render='Form' tailwind=true}
'use client'

import { useState } from 'react'

function Form() {
  const [email, setEmail] = useState('')
  const valid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  return (
    <form>
      <label>
        What is your email address?
        <input
          class="border"
          value={email}
          onInput={(event) => {
            setEmail(event.target.value)
          }}
        />
      </label>
      {email && valid && <p>{email} is valid</p>}
      {email && !valid && <p>{email} is not valid</p>}
    </form>
  )
}
~~~

::::: break-inside-avoid
- The body of the function is reexecuted
  every time `email` changes.
:::::

# Example: Todo app

::::: break-inside-avoid
~~~ tsx {.run framework="react" render="Todo"}
'use client'

import { useState } from 'react'

function Todo() {
  const [newTask, setNewTask] = useState('')
  const [tasks, setTasks] = useState([])
  return (
    <form onSubmit={(event) => {
      event.preventDefault()
      setTasks([...tasks, newTask])
      setNewTask("")
    }}>
      <input
        value={newTask}
        onInput={(event) => setNewTask(event.target.value)}
      />
      <button>Submit</button>
      <ul>
        {tasks.map(task => <li>{task}</li>)}
      </ul>
    </form>
  )
}
~~~
:::::

# Exercise

- Modal
