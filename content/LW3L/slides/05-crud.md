---
title: API partie II
slideshow: true
---

# Exercises {.w-1--2}

::: exercise
Construisez un blog qui vérifie les contraintes suivantes:

- La page `/` affiche la liste des articles
- La page `/article.html?id=3` affiche le troisième article
- La page `/admin.html` affiche l'ensemble des articles en permettant de les modifier, supprimer,
  et comporte un lien qui permet de créer un article.
- Les articles sont stockés sur un backend (FastAPI)

BONUS:

- Faites le data fetching correctement:
  - Un spinner quand les données sont en train de charger
  - Évitez les *race conditions*
- Faire une *Single Page Application* avec React Router.
:::

# Paramètres dans l'URL {.w-1--2}

Pour obtenir les paramètres dans l'URL:

``` js {.run}
// Obtenir l'ID quand l'adresse est /post.html?id=1
const queryString = window.location.search; // ?id=1
const urlParams = new URLSearchParams(queryString);
urlParams.get('id') // 1
```

# Paramètres dans l'URL côté backend {.w-1--2}

```python
import fastapi
import pydantic

app = fastapi.FastAPI()

class User(pydantic.BaseModel):
    first_name: str
    last_name: str

users: list[User] = [
    User(first_name="Martin", last_name="Fockedey")
]

@app.get("/users/{user_id}")
def read_user(user_id: int):
    if user_id not in range(len(users)):
        raise HTTPException(status_code=404, detail="User not found")
    return users[user_id]

@app.put("/users/{user_id}")
def update_user(user_id: int, user: User):
    if user_id not in range(len(users)):
        raise HTTPException(status_code=404, detail="User not found")
    users[user_id] = user
    return user
```

# Bonus: éviter les 'race conditions' {.columns-2}

```tsx {.run framework="react"}
function App() {
  const [url, setUrl] = React.useState('')
  const [data, setData] = React.useState({})
  React.useEffect(() => {
    const ignore = false
    async function getData() {
      try {
        const data = await fetch(url)
        const json = await data.json()
        if (!ignore) {
          setData(json)
        }
      } catch {
        setData(null)
      }
    }
    getData()
    return () => {
      ignore = true
    }
  }, [url])
  return (
    <>
      <input value={url} onInput={(e) => setUrl(e.target.value)} />
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </>
  )
}
```

::::: break-inside-avoid
#### Explications

- On ajoute la variable `ignore`,
  dont le rôle sera de déterminer si les données sont à jour.
  Par défaut, la variable `ignore` a pour valeur `false`,
  mais on la change à `true` lorsque le résultat de la requête ne nous intéresse plus.

- Lignes 18-20: la fonction retournée dans un `useEffect` est effectuée
  avant toute réexécution de l'effet avec des nouvelles valeurs.
  Dans notre exemple, ces lignes seront exécutées
  à chaque changement d'url, avant le `fetch`.
  On indique alors que les données ne sont plus à jour via `ignore = true`.

- Lignes 10-12: On set `data` seulement s'il ne faut pas ignorer les données reçues.
:::::

# Bonus: création d'un hook React {.columns-2}

``` tsx {framework="react"}
function useFetch(url, params) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    const ignore = false
    async function getData() {
      try {
        const data = await fetch(url)
        const json = await data.json()
        if (!ignore) {
          setData(json)
        }
      } catch {
        setData(null)
      }
    }
    getData()
    return () => {
      ignore = true
    }
  }, [url, params])
  return { data }
}
```

::::: break-inside-avoid
#### Explications

- Faire des requêtes est une tâche fréquente
  et il est utile de créer une fonction à réexécuter.
  React a malheureusement des [règles spéciales](https://react.dev/reference/rules#rules-of-hooks) pour cela.

::: exercise
Modifiez ce hook pour qu'il retourne `loading: true`
pendant que la requête est en cours,
et qu'il spécifie s'il y a une erreur.
:::
:::::

# Bonus: Single Page Applications {.columns-2}

``` html {.run}
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<div id="app"></div>
<script type="text/babel" data-presets="react" data-type="module">
  import React from 'https://esm.sh/react@18'
  import ReactDOM from 'https://esm.sh/react-dom@18'
  import { MemoryRouter as Router, Routes, Route, Link } from 'https://esm.sh/react-router-dom'

  const App = () => (
    <Router>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )

  const Home = () => <h2>Home</h2>
  const About = () => <h2>About</h2>

  const appContainer = document.getElementById('app')
  ReactDOM.createRoot(appContainer).render(<App />)
</script>
```

::::: break-inside-avoid
Voir la [https://reactrouter.com/home](documentation de React-Router).

Le code à gauche doit employer `MemoryRouter` pour fonctionner sur le slide,
mais il est plus approprié pour vous d'employer `HashRouter` (ligne 6).
:::::