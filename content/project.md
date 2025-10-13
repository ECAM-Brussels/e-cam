---
title: Projet e-cam
slideshow: true
---

# Lancer une copie locale {.w-1--2}

::: {.info title="Prérequis"}
- Sur **Windows**, installez WSL, git et [Docker](https://docker.com)
- Sur **MacOS**, [installez homebrew](https://brew.sh/) et ensuite lancez

  ~~~bash
  brew install git docker
  ~~~
:::

::: remark
Sur Windows,
il est conseillé de mettre le code sur WSL.
:::

~~~ bash
git clone https://github.com/ECAM-Brussels/e-cam.git
cd e-cam
docker compose up
~~~

# Architecture de l'application

~~~ mermaid
flowchart LR
  client["Client"] --> server["Serveur"]
  server --> graphql["API GraphQL"]
  server --> db["Base de données"]
~~~

- Client/Serveur
  - Partie *Web pure* du projet
  - Application **isomorphe** écrite avec [SolidStart](https://docs.solidjs.com/solid-start/)
  - TypeScript
- API GraphQL
  - Partie calcul scientifique
  - Écrite en Python avec [Strawberry](https://strawberry.rocks)

# Tâches

- Créer un **type d'exercice** en mathématiques, physique ou chimie
  - Interface pour l'étudiant.e
  - Correction automatique
  - Génération d'exercices
  - Feedback pour l'étudiant
  - Tests unitaires

- Créer une interface permettant aux enseignant.es de créer une "interro"

- Améliorer le coeur de l'application
  - Score ELO par domaine/cours
  - Possibilité d'exercices en plusieurs stades
  - Améliorer l'expérience développeur

# Anatomie d'un type d'exercice {.columns .columns-2}

~~~ typescript
createExerciseType({
  name: 'VerySimpleExercise',
  question: z.object({
    answer: z.string().nonempty(),
  }),
  attempt: z.string().nonempty(),
  Component: (props) => (
    <>
      <p>Tapez exactement: {props.question.answer}</p>
      <label>
        Réponse:
        <input
          name="attempt"
          value={props.question.answer}
        />
      </label>
    </>
  ),
  mark: (question, attempt) => {
    return attempt === question.answer
  }
})
~~~

::: col
## Explications

Le but de cet exercice est de recopier l'énoncé.
L'utilisateur aura une réponse correcte
si et seulement si sa tentative est égale au texte.

- **name**: un nom identifiant le type d'exercice de manière unique.

- **question**: schéma décrivant la forme d'une question.
  Ici, une question est un object qui a pour propriété "answer",
  défini comme une chaîne non vide.

- **attempt**: schéma décrivant la forme de la tentative de l'étudiant.e.
  Ici, sa tentative est une chaîne non vide.

- **Component**: interface de l'exercice vue par l'étudiant.e.

- **mark**: fonction recevant la question et la tentative en argument,
  et qui renvoie `true` ou `false`
  en fonction de si la tentative de l'étudiant.e est correcte.
:::

# Correction symbolique {.columns .columns-2}

::: col
- La correction symbolique se fait en **Python**,
  via la librairie symbolique [sympy](https://sympy.org)
:::

::: {.example title="Correction d'une équation du second degré"}
~~~ python {.run}
from sympy import *
x = Symbol("x")

# Question
equation = x**2 - 5*x + 6

# Tentative étudiant
attempt = {2, 3}

# Correction
if solveset(equation) == attempt:
    print("Correct")
else:
    print("Incorrect")
~~~
:::

# Contribution {.grid .grid-columns-2}

~~~ bash
# Sélection de la branche de départ
git checkout main
git pull

# Création de la nouvelle branche
git checkout -b new_cool_feature

# Développement, commits

# Demande de review
git pull
git merge main
~~~

# Timeline

- [Tutoriel Solid-js](https://www.solidjs.com/tutorial/introduction_basics)
- [Tutoriel Sympy](https://docs.sympy.org/latest/tutorials/intro-tutorial/index.html)
