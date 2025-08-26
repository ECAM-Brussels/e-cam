---
title: React
slideshow: true
---

# Table des matières {.w-1--2}

::::: {.border .rounded-xl .shadow .px-3 .mb-8}
#### Consigne

Lisez les exemples ci-dessous pour vous aider à résoudre les exercices.
:::::

::::: {.border .rounded-xl .shadow .px-3}
#### Table des matières

- [Énoncés des exercices](#/1)
- Exemples
  - [Page de base: hello world](#/2)
  - [Compteur](#/3)
  - [Composant et props](#/4)
  - [Composabilité et enfants](#/5)
  - [Formulaire](#/6)
  - [Tableaux](#/7)
- [Comment fonctionne React?](#/8)
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
  import React from 'https://esm.sh/react@18'
  import ReactDOM from 'https://esm.sh/react-dom@18'

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

#### Documentation officielle

- [JSX](https://fr.react.dev/learn/writing-markup-with-jsx)
- [JS dans le JSX avec les accolades](https://fr.react.dev/learn/javascript-in-jsx-with-curly-braces)
:::

# Components and props {.columns-2}

~~~ tsx {.run .break-inside-avoid framework="react"}
function Counter({ initialValue = 0, increment = 1 }) {
  const [value, setValue] = React.useState(initialValue)
  return (
    <p>
      <button
        onClick={() => {
          setValue(value + increment)
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

#### Documentation officielle
- [Props](https://fr.react.dev/learn/passing-props-to-a-component)
:::

# Exemple: enfants {.columns-2}

~~~ tsx {.run .break-inside-avoid framework="react"}
function App() {
  return (
    <CVLine date="2022-2025" employer="ECAM" title="Bachelier en sciences industrielles">
      <ul>
        <li>Grade: distinction</li>
        <li>Cours préféré: technologies web</li>
      </ul>
    </CVLine>
  )
}

function CVLine({ children, employer, date, title }) {
  return (
    <div>
      <h3>{title}, {employer} ({date}</h3>
      {children}
    </div>
  )
}
~~~

::::: break-inside-avoid
#### Explications

`children` est une propriété spéciale d'un composant.
Elle sera populée par le le contenu situé entre la balise ouvrante et la balise fermante.

Dans notre exemple, `{children}` à la ligne 16 sera remplacé par la liste définie entre les lignes 4 et 7.

#### Documentation

- [Passer du JSX comme enfant](https://fr.react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)
:::::

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
  (age > 18) || 'mineur' // Retourne 'mineur'
  ```

#### Documentation

- [Affichage conditionnel](https://fr.react.dev/learn/conditional-rendering)
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

#### Documentation

- [Afficher des listes](https://fr.react.dev/learn/rendering-lists)
:::::

# Comment fonctionne React? Pourquoi l'utiliser? {.columns-2}

::::: break-inside-avoid
- Le JSX est transpilé en appel de fonctions.
  Par exemple, `<h1 className="greeting">Hello, world!</h1>` devient

  ~~~ js
  React.createElement(
    'h1',
    { className: 'greeting' },
    'Hello, world!'
  );
  ~~~

- À chaque changement d'état, le composant est réexécuté entièrement
  sur une copie du DOM (le *Virtual DOM*) pour des raisons de performance.

- React compare le DOM virtuel et le vrai DOM pour mettre à jour ce dernier le plus efficacement possible.
:::::

::::: break-inside-avoid
::: question
Pourquoi React est-il utile?
:::

- **Déclaratif**: on donne une *description* du DOM à tout moment,
  les mutations sont faites par React.

- **Encapsulation**: les composants sont développés en isolation les uns des autres.
  Cela rend également les tests plus faciles.

- **Composition**: les composants sont un mécanisme efficace de réutilisation de code,
  car ils peuvent dépendre de paramètres, s'imbriquer et se répéter.
:::::
