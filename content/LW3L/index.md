---
title: Web Technologies
---

# Web Technologies

![](/images/LW3L.png){.w-full .lg:max-h-96 .max-h-84 .object-cover .rounded-xl .opacity-70}

::: {.bg-white .rounded-xl .p-4 .shadow}

## Outline

1. HTML and CSS
2. JavaScript and the DOM
3. Consuming APIs and JavaScript frameworks
4. Express
5. Databases
6. Review

## Tests

Tailwind + React

~~~ tsx {.run framework="react" tailwind="true"}
function App() {
  const [count, setCount] = React.useState(0)

  function increaseCount() {
    setCount(count + 1)
  }

  return (
    <button
      class="border rounded text-3xl bg-green-700 text-white px-8 py-3"
      onClick={increaseCount}
    >
    {count}
    </button>
  )
}
~~~

:::