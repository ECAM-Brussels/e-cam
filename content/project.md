---
title: Projet e-cam
slideshow: true
---

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

# Anatomie d'un type d'exercice {.columns .columns-2}

~~~ typescript
createExerciseType({
  name: 'VerySimpleExercise',
  question: z.object({
    text: z.string().nonempty(),
    answer: z.string(),
  }),
  attempt: z.string(),
  Component: (props) => (
    <>
      <p>{props.question.text}</p>
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

- **name**

- **question**: schéma décrivant la forme d'une question,
  défini en utilisant la librairie [Zod](https://zod.dev).

- **attempt**: schéma décrivant la forme de la tentative de l'étudiant,
  défini en utilisant la librairie [Zod](https://zod.dev).

- **Component**: interface de l'exercice vue par l'étudiant.e.
  Écrit en [SolidJS](https://solidjs.com/).

- **mark**: fonction recevant la question et la tentative en argument,
  et qui renvoie `true` ou `false`
  en fonction de si la tentative de l'étudiant.e est correcte.
:::
