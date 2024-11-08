---
title: React
slideshow: true
---

# Table des matières {.w-1--2}

::::: {.border .rounded-xl .shadow .px-3 .mb-8}
#### Consigne

Lisez les exemples ci-dessous avant d'entamer les exercices.
:::::

::::: {.border .rounded-xl .shadow .px-3}
#### Table des matières

- [Énoncés des exercices](#/1)
- Exemples
  - [Page de base: hello world](#/2)
  - [Compteur](#/3)
  - [Composant et props](#/4)
  - [Formulaire](#/5)
  - [Tableaux](#/6)
:::::

# Exercices {.columns-2}

::: exercise
Implémentez une validation de formulaire d'inscription.
Proposez à l'utilisateur d'entrer son email, un mot de passe et le confirmez.
Vérifiez que l'email est valide, et que les mots de passe coïncident,
sinon donnez du feedback à l'utilisateur en direct.
:::

::: exercise
Implémentez le jeu [Wordle](https://www.nytimes.com/games/wordle/index.html),
qui permet à l'utilisateur de deviner un mot de 5 lettres.
Lorsque l'utilisateur soumet sa tentative,

- coloriez en vert les lettres correctement placées
- coloriez en orange les lettres qui sont dans le mot à deviner
  mais qui sont mal placées.
:::

::: exercise
Implémentez le jeu Puissance 4.
:::

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

::::: remark
À partir de maintenant, nous ne mettrons que le code de la fonction `App`.
:::::
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
- La fonction retourne du JSX, qui représente la création de noeuds dans le DOM via une syntaxe similaire au HTML.
  Le JSX diffère principalement du HTML par l'emploi du `camelCase`, e.g. `onClick` au lieu de `onclick`,
  et par le fait que les attributs sont en JavaScript au lieu de simple chaînes.
  Les expressions entre crochets peuvent contenir une expression Javascript arbitraire.
:::

# Components and props {.columns-2}

~~~ tsx {.run .break-inside-avoid framework="react"}
function Counter({ initialValue, increment }) {
  const [value, setValue] = useState(initialValue || 1)
  return (
    <p>
      <button
        onClick={() => {
          setValue(value + (increment || 1))
        }}
      >
        {value}
      </button>
    </p>
  )
}

function App() {
  return (
    <>
      <Counter />
      <Counter initialValue={2} increment={3} />
    </>
  )
}
~~~

::: break-inside-avoid
### Explications

- On peut créer des balises avec des attributs simplement en créant une fonction:
- Lignes 1-14: définition de `<Counter />` qui a deux propriétés (attributs) possibles:
  `initialValue` et `increment`.
- Appel de `Counter` deux fois dans `<App />`.
- Comme une fonction ne peut retourner qu'une balise (enfants non compris),
  on enveloppe les deux `<Counter />` dans un **fragment** `<></>`,
  une balise vide qui n'a pas de rôle particulier et qui est propre au JSX.
:::

# Exemple: formulaire et condition {.columns-2}

~~~ tsx {.run .break-inside-avoid framework="react"}
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

::: break-inside-avoid
### Explications

- Synchronisation entre `name` et le contenu de l'input:
  - quand `name` change, l'input change aussi grâce à la ligne 9
  - quand l'input change, l'événement 'input' est déclenché;
    les lignes 10 à 12 appellent `setName` pour changer `name`.
- Ligne 15: condition affirmative (JavaScript standard)

  ```js
  const age = 21
  (age > 18) && 'majeur' // Retourne 'majeur'
  ```

  Une expression avec un `&&` (et logique) retourne `false`
  si la première expression est fausse,
  mais si elle est vraie,
  elle retourne la valeur de la seconde expression.

- Ligne 16: condition négative (JavaScript standard)

  ```js
  const age = 12
  (age < 18) || 'mineur' // Retourne 'majeur'
  ```
:::

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
- `tasks` contient une liste de tâches,
  mise à jour lorsque l'utilisateur clique sur le bouton.
- Lignes 5 à 9: soumission d'une nouvelle tâche.
  - `[...tasks]` recrée l'array `task` (avec une nouvelle référence)
  - `[...tasks, newTask]` recrée l'array `task` et y ajoute `newTask`
- Ligne 18: boucle équivalente à `for task in tasks`.
  Plus explicitement,
  `tasks.map(function)` applique `function` à chaque élément de `tasks`.
  Par exemple,
  ```js
  [1, 2, 3, 4].map(n => n * 2) // [2, 4, 6, 8]
  ```
  En JSX, une liste est affichée comme un fragment avec comme enfants les éléments de la liste.
:::::