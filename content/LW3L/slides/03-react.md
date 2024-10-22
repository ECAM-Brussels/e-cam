---
title: React
slideshow: true
---

# Présentation: React

- Développé par Facebook (maintenant Meta)

# React: Hello world {.w-3--5}

~~~ html {.run}
<!-- Import pour traiter le JSX (plus tard) -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<!-- React placera notre application ici -->
<div id="app"></div>

<script type="text/babel" data-presets="react" data-type="module">
  import React from 'https://esm.sh/react'
  import ReactDOM from 'https://esm.sh/react-dom'

  // Crée un composant (~ une balise) <App />
  function App() {
    return <>Hello world</>
  }

  // On attache <App /> à div#app
  const appContainer = document.getElementById('app')
  const root = ReactDOM.createRoot(appContainer)
  root.render(<App />)
</script>
~~~

# Exemple: le compteur {.w-1--2}

~~~ tsx {.run framework="react"}
function App() {
  const [count, setCount] = React.useState(0)

  return (
    <button onClick={() => {
      setCount(count + 1)
    }}>
      {count}
    </button>
  )
}
~~~

::: remark
React se charge des mutations du DOM pour vous.
:::

# Exemple: formulaire et condition {.w-1--2}

~~~ tsx {.run framework="react"}
function App() {
  const [name, setName] = React.useState("")

  return (
    <>
      <label>
        Quel est votre nom?
        <input
          value={name}
          onInput={(event) => {
            setName(event.target.value)
          }}
        />
      </label>
      {name && <p>Bonjour {name}!</p>}
      {name || <p>Le nom entré est vide!</p>}
    </>
  )
}
~~~

# Travailler avec des tableaux {.columns-2}

::::: break-inside-avoid
~~~ tsx {.run framework="react"}
function App() {
  const [newTask, setNewTask] = React.useState('')
  const [tasks, setTasks] = React.useState([])
  return (
    <>
      <input
        value={newTask}
        onInput={(event) => {
          setNewTask(event.target.value)
        }}
      />
      <input type="submit" onClick={() => {
        setTasks([...tasks, newTask])
        setNewTask("")
      }} />
      <ul>
        {tasks.map(task => <li>{task}</li>)}
      </ul>
    </>
  )
}
~~~
:::::

::::: break-inside-avoid
### Explications

- `newTask` est synchronisé avec l'`input`
- `tasks` contient une liste de tâches
:::::

# Hello