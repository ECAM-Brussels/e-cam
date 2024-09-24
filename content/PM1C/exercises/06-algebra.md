---
title: Algèbre
slideshow: true
---

# Préparation {.columns-2}

::::: break-inside-avoid-column
::: {.exercise title="Exercices 31, 34, 36, 42, 44"}
Factorisez:

- $x^2 + 7x + 6$
- $2x^2 + 7x - 4$
- $8x^2 + 10x + 3$
- $x^3 - 27$
- $x^3 - 4x^2 + 5x - 2$
:::

Pour vérifier vos réponses les réponses, changez le code ci-dessous.

~~~ python {.run}
from sympy import *
x = Symbol("x")
factor(x**2 + 7*x + 6)
~~~
:::::

::: {.exercise title="Exercise 55"}
Compléter le carré: $x^2 + 2x + 5$
:::

::: {.exercise title="Exercice 136"}
Résouds $x^2 \geq 5$.
:::

::: {.exercise title="Exercice 151"}
Résouds $|x - 4| < 1$.
:::