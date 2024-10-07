---
title: Fonctions
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="Exercices 1.1: 40, 42, 43"}
Trouvez le domaine des fonctions:

- $f(x) = \frac {x^2 + 1} {x^2 + 4x - 21}$
- $g(t) = \sqrt {3 - t} - \sqrt{2 + t}$
- $h(x) = \frac 1 {\sqrt[4]{x^2 - 5x}}$
:::

::: {.exercise title="Exercice 1.1.67"}
Exprimez l'aire d'un triangle équilatéral comme fonction de l'un de ses côtés.
:::

::: {.exercise title="Exercice 1.1.81"}
Déterminez si $f(x) = \frac x {x^2 + 1}$ est paire, impaire, ou aucun des deux.
:::

::: {.exercise title="Exercice 1.2: 11, 12"}
Trouvez l'expression des fonctions quadratiques dont le graphe est montré ci-dessous.
![](/images/exercises/1.2.11.png)
:::

# Exercice 1.1.44 {.w-1--2}

::: exercise
Trouvez le domaine de la fonction
$$
f(u) = \frac {u + 1} {1 + \frac 1 {u + 1}}
$$
:::

# Exercice 1.1.72 {.w-1--2}

::: exercise
Une fenêtre a la forme d'un rectangle surmontée d'un demi cercle.
Sachant que le périmètre est $10$ m,
exprimer l'aire $A$ de la fenêtre comme une fonction de la largeur $x$ de la fenêtre.
:::

# Exercice 1.1.74 {.w-1--2}

::: exercise
Une compagnie électrique facture ses client une prise en charge de $10$ dollars par mois,
plus $6$ cents par kilowatt-heure pour les premiers $1200$ kWh,
et $7$ cents par kilowatt-heure après $1200$ kWh.
Exprime le prix mensuel $E$ comme une fonction de la quantité d'électricité utilisée $x$.
Ensuite, tracez le graphe de $E$ pour $0 \leq x \leq 2000$.
:::

# Exercice 1.1.82 {.w-1--2}

::: exercise
Déterminez si $f$ est paire, impaire, ou aucun des deux.

- $f(x) = \frac {x^2} {x^4 + 1}$
- $f(x) = \frac x {x + 1}$
- $f(x) = x |x|$
:::

# Exercice 1.2.13 {.w-1--2}

::: exercise
Trouvez une formule pour une fonction cubique $f$ si $f(1) = 6$,
et $f(-1) = f(0) = f(2) = 0$.
:::

~~~ python {.run}
from sympy import *
a, x = symbols("a x")
P = expand(a * (x + 1) * x * (x - 2))
P = P.subs({a: solve(Eq(P.subs(x, 1), 6))[0]})
~~~

# Exercice 1.2.18 {.w-1--2}

![](/images/exercises/1.2.18.png)