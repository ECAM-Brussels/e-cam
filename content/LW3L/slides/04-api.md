---
title: Gestion de l'asynchrone
slideshow: true
lang: fr
---

# Exercices {.columns-2}

::: exercise
Créez un Pokedex en utilisant React et l'API [https://pokeapi.co/](https://pokeapi.co/).
:::

::: exercise
Créez une application fullstack "Todo list" pour traiter vos tâches.
Vous devez utiliser React en front-end,
et FastAPI en backend.
:::

# Motivations {.w-1--2}

Certaines opérations, comme les communications serveur-client, prennent du temps.
Durant l'attente, est-il sage de bloquer le thread principal?

#### Situations utiles de la vie courante:

- Au McDonald, quand je commande mon cheeseburger à la borne,
  je ne mange plus le ticket de caisse.
  Je comprends que ce dernier est une **promesse** de cheeseburger,
  mais pas un cheeseburger.
  ![](https://www.dogster.com/wp-content/uploads/2024/04/Naughty-playful-puppy-dog-border-collie-playing-with-papers_Julia-Zavalishina_Shutterstock.jpg){.w-72}

- Dans the **Queen's Gambit**, Beth Harmon joue aux échecs contre 12 personnes à la fois.
  Après chaque mouvement, elle n'attend pas la réponse de son adversaire, elle passe au suivant.

  Beth est consciente que ses coups n'engendrent que des **promesses** de réponse de la part de ses adversaire.
  Elle met donc l'exécution de sa partie _en pause_, et y reviendra quand la promesse de réponse sera résolue
  et qu'elle aura le temps.

# Fetch {.w-1--2}

`fetch(url, params)` effectue une requête vers `url`
et retourne une **promesse** de réponse.

#### Quelques paramètres utiles

- `method`: Verbe HTTP tels que `GET` (défaut), `POST`, `PUT`, `DELETE`, ...
- `body`: pratique pour envoyer des données (e.g. JSON)

::: remark
[Plus d'informations sur fetch](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch)
:::

::: example
1. `fetch('https://pokeapi.co/api/v2/pokemon/pikachu')` effectue une requête `GET`
1. Pour effectuer une requête `POST`:

~~~ js
fetch('/users/', {
  method: 'POST',
  body: JSON.stringify({
    lastName: 'Fockedey',
    firstName: 'Martin',
  })
})
~~~
:::

# Async/Await {.columns-2}

::::: break-inside-avoid

```js
// Ne donne pas la réponse, juste une promesse!
const response = fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
console.log(response)
```

```js
getPokemonData('pikachu')
console.log('B')

async function getPokemonData(name) {
  console.log('A')
  const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + name)
  const data = await response.json()
  console.log('C', data)
  return data
}
```

::: example
Exécutez ceci dans vos outils développeurs!
:::
:::::

#### Ordre d'exécution

- **L1**: On appelle la fonction **asynchrone** `getPokemonData`
  avec `pikachu` comme `name`.

- **L4-6**: On exécute le corps de la fonction jusqu'au premier `await`.
  On libère le thread principal jusqu'à la résolution de la promesse

- **L2**: On affiche `B`.

- On se tourne les pouces parce qu'il n'y a rien à faire

- **L6**: Le fetch est terminée, la promesse de réponse est résolue,
  et l'`await` retourne la valeur de la promesse.

- **L7**: On libère le thread principal pendant qu'on analyse la réponse du navigateur.

- On se tourne les pouces parce qu'il n'y a rien à faire

- **L7-10**: On réexécute le reste de la fonction.

# React: `useEffect` {.columns-2}

::::: break-inside-avoid
Rappelons que React réexécute entièrement vos functions à chaque changement d'état.
Ceci est peut-être trop fréquent.
Il est possible d'échapper à ce comportement avec `React.useEffect`.

```js
React.useEffect(effect, dependencies)
```

::: remark
La fonction `useEffect` ne peut seulement être appelée dans un composant,
au niveau le plus haut.
:::

`effect`
: fonction (obligatoirement synchrone) exécutée à chaque fois
qu'une des dépendences listées dans `dependencies` change.

`dependencies`
: Liste des variables observées.
Lorque l'un change, on réexécute `effect`.
:::::

::: example

```tsx {.run framework="react"}
function App() {
  const [count, setCount] = React.useState(0)

  // Réexécuté quand les dépendences ([]) changent,
  // c'est-à-dire jamais
  React.useEffect(() => {
    setInterval(() => {
      setCount(count => count + 1)
    }, 1000)
  }, [])

  return <p>Count: {count}</p>
}
// --- fragment
function App() {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount(count => count + 1)
    }, 1000)

    // Plus propre:
    // useEffect permet de retourner une fonction
    // dont le but est de nettoyer
    return () => {
      clearInterval(interval)
    }
  }, [])

  return <p>Count: {count}</p>
}
```

:::

# Exemple {.columns-2}

```tsx {.run framework="react"}
function App() {
  const [url, setUrl] = React.useState('posts?userId=1')
  const [data, setData] = React.useState({})

  React.useEffect(() => {
    async function getData() {
      const data = await fetch('https://jsonplaceholder.typicode.com/' + url)
      const json = await data.json()
      setData(json)
    }
    getData()
  }, [url])

  return (
    <>
      <input value={url} onInput={(e) => setUrl(e.target.value)} />
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </>
  )
}
```

# FastAPI {.w-1--2}

Nous allons maintenant installer un serveur backend.
Nous utiliserons la librairie Python FastAPI.

```
pip install fastapi[standard]
```

::: remark
FastAPI se base énormément sur les **annotations de types**,
ignorées par VS Code par défaut.

Pour les activer, appuyez sur `Ctrl+Shift+P` et sélectionnez
'Preferences: Open User Settings (JSON)', et assurez-vous qu'il contienne:

```json
{
  "python.analysis.typeCheckingMode": "strict",
}
```
:::

# FastAPI: hello world {.columns-2}

::::: break-inside-avoid
```python
import fastapi

app = fastapi.FastAPI()

@app.get("/")
def root():
    return {"message": "Hello World"}
```

::: remark
Pour lancer le server, utilisez la commande `fastapi dev app.py`,
où vous remplacez `app.py` par le chemin relatif vers votre fichier.
Le serveur sera automatiquement relancé en cas de modification de fichiers.
:::
:::::

::::: break-inside-avoid
#### Explications

- **L1-L3**: Création d'une application FastAPI.

- **L5**: décorateur pour indiquer que la fonction sera utilisée
  pour répondre aux requêtes `GET` pour l'URL `/`.
:::::

# FastAPI: servir un dossier tel quel {.columns-2}

Pour servir un dossier `static`, créez-le et ajouter le code suivant.

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Votre code

# Cette ligne doit être à la fin du fichier!
app.mount("/", StaticFiles(directory="static", html=True), name="static")
```

::::: break-inside-avoid
#### Explications

Les fichiers dans `static` seront automatiquement accessible par des requêtes `GET`:

- `GET /test.css` renverra `static/test.css` si ce fichier existe.
:::::

# Pydantic: validation de modèles {.w-1--2}

::: question
Comment s'assurer que les données entrées par l'utilisateur sont valides?
:::

```python {.run}
import pydantic

class User(pydantic.BaseModel):
    last_name: str
    first_name: str
    age: int | None = None

user = {
    "last_name": "NGUYEN",
    "first_name": "Khoi",
    "extra_field": True
}
User(**user)
```

# FastAPI et Pydantic {.columns-2}

```python
import pydantic

class User(pydantic.BaseModel):
    first_name: str
    last_name: str
    age: int | None = None

users: list[User] = [
    User(first_name="Martin", last_name="Fockedey"),
    User(first_name="Khoi", last_name="Nguyen"),
]

import fastapi
app = fastapi.FastAPI()

@app.get("/users")
def get_users() -> list[User]:
    return users

@app.post("/users")
def register(user: User) -> User:
    users.append(user)
    return user
```

::::: break-inside-avoid
#### Explications

- **L1-L6**: définition d'un modèle **User** qui sera utilisé
  pour valider les données envoyées à l'API.

- **L8-L11**: `users` contient une liste d'utilisateurs modifiables.
  Un vrai site emploierait une base de données,
  mais ici on emploie la mémoire.

- **L16-18**: crée une route de telle sorte que `GET /users` retourne la liste des utilisateurs.
  FastAPI utilise l'annotation de type et utilise Pydantic pour vérifier que les données sont valides.

- **L20-23**: crée une route de sorte qu'une requête `POST /users` avec un utilisateur dans le corps
  crée un nouvel utilisateur.
  Grâce à l'annotation de type à la ligne 21,
  FastAPI validera l'utilisateur avec le modèle Pydantic.
:::::