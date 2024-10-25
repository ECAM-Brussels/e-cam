---
title: React
slideshow: true
---

# Présentation: React

- Développé par Facebook (maintenant Meta)

- Framework le plus utilisé.

# Pourquoi utiliser un framework? {.w-1--2}

::: question
Pourquoi utiliser un framework ?
:::

- Synchroniser l'état et le DOM est une tâche très difficile.

# React: Hello world {.columns-2}

~~~ html {.run .break-inside-avoid}
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<div id="app"></div>

<script type="text/babel" data-presets="react" data-type="module">
  import React from 'https://esm.sh/react'
  import ReactDOM from 'https://esm.sh/react-dom'

  function App() {
    return <p>Hello world</p>
  }

  const appContainer = document.getElementById('app')
  ReactDOM.createRoot(appContainer).render(<App />)
</script>
~~~

::: break-inside-avoid
### Explications

- **L1**: Import d'un compilateur qui permet d'écrire du JSX,
  un mélange hybride entre le HTML et le JavaScript.

- **L3**: Conteneur où React placera l'application.

- **L5**: On signale au compilateur que ce code contient du code
  à transpiler en JavaScript.

- **L10-12**: On crée un composant `<App />` en définissant une **fonction** qui retourne ce qui semble être du HTML.
  Ce mélange hybride s'appelle JSX.

- **L13-14**: On attache `<App />` au noeud `#app`.
:::

# Exemple: le compteur {.columns-2}

~~~ tsx {.run .break-inside-avoid framework="react"}
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

::: break-inside-avoid
- Les **variables réactives** sont créées avec `React.useState`.
  Ici, on définit une variable `count` et `setCount`:
  le premier pour avoir la valeur du compteur à tout moment,
  et `setCount` pour changer la valeur du compteur.
  Tout appel à `setCount` **réexécutera complètement** la fonction `App`.
- La fonction retourne du JSX.
  Le JSX diffère principalement du HTML par l'emploi du `camelCase`, e.g. `onClick` au lieu de `onclick`,
  et par le fait que les attributs sont en JavaScript au lieu de simple chaînes.
  Les expressions entre crochets peuvent contenir une expression Javascript arbitraire.
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
    <form onSubmit={(event) => {
      event.preventDefault()
      setTasks([...tasks, newTask])
      setNewTask("")
    }}>
      <input
        value={newTask}
        onInput={(event) => {
          setNewTask(event.target.value)
        }}
      />
      <input type="submit" />
      <ul>
        {tasks.map(task => <li>{task}</li>)}
      </ul>
    </form>
  )
}
~~~
:::::

::::: break-inside-avoid
### Explications

- `newTask` est synchronisé avec le texte de l'`input`

- `tasks` contient une liste de tâches
:::::