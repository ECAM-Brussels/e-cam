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

Pour vérifier vos réponses, changez le code ci-dessous.

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

# Factorisation {.w-1--2}

::: {.exercise title="Exercices 37, 46"}
Factorise les expressions suivantes:

- $6x^2 - 5x - 6$
- $x^3 - 2x^2 - 23x + 60$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
# Changez cette ligne
factor(6*x**2 - 5*x - 6)
~~~

# Complétion du carré {.w-1--2}

::: {.exercise title="Exercices 56, 60"}
Compléter le carré dans les expressions suivantes:

- $x^2 - 16x + 80$
- $3x^2 - 24x + 50$
:::

~~~ python {.run}
from sympy import *
x, alpha, beta, gamma = symbols("x alpha beta gamma")
ans = alpha * (x + beta) ** 2 + gamma
expr = x**2 - 16*x + 80 # à changer
subs = solve(Eq(expr, ans), [alpha, beta, gamma])
ans.subs(subs)
~~~

# Inéquations {.w-1--2}

::: {.exercise title="Exercices 137, 140"}
Résolvez les inéquations suivantes et illustrez l'ensemble des solutions sur la droite réelle

- $x^3 - x^2 \leq 0$
- $x^3 + 3x < 4x^2$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
solveset(x**3 - x**2 <= 0, x, S.Reals)
~~~

# Équations avec valeur absolue {.w-1--2}

::: {.exercise title="Exercices 147, 153"}
Résolvez les (in)équations suivantes:

- $|x + 3| = |2x + 1|$
- $|x + 5| \geq 2$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
solveset(Eq(Abs(x + 3), Abs(2*x + 1)), x, S.Reals)
# solveset(Abs(x + 5) >= 2, x, S.Reals)
~~~