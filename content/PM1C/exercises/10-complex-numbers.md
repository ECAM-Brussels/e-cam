---
title: Nombres complexes
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="Exercices H: 5, 8, 12"}
Calculez et mettez la réponse sous la forme algébrique $a + bi$:

a. $\overline {12 + 7i}$
b. $\frac {3 + 2i} {1 - 4i}$
c. $i^{100}$
:::

::: {.exercise title="H.16"}
Déterminez le complexe conjugué et le module de $-1 + 2 \sqrt 2 i$.
:::

::: {.exercise title="H.21"}
Résolvez $z^2 + 2z + 5 = 0$ dans $\mathbb C$.
:::

::: {.exercise title="H.30"}
Déterminez les formes trigonométriques et exponentielles de $z = 4 \sqrt 3 - 4i$, $w = 8i$, puis déduisez-en les formes trigonométriques et exponentielles de $zw$, $z / w$ et $1/z$.
:::

::: {.exercise title="H.34"}
Calculez $(1 - \sqrt 3 i)^5$ à l'aide de la forme exponentielle.
:::

# Exercice H.23 {.w-1--2}

::: {.exercise title="H.23"}
Résolvez l'équation $z^2 + z + 2 = 0$ dans $\mathbb C$.
:::

~~~ python {.run}
from sympy import *
z = Symbol("z")
solveset(z**2 + z + 2, z, S.Complexes)
~~~

# Exercice H.31 {.w-1--2}

::: exercise
Déterminez les formes trigonométriques et exponentielles de $z = 2 \sqrt 3 - 2 i$ et $w = -1 + i$ et
déduisez-en les formes trigonométriques et exponentielles de $zw$, $z/w$ et $1/z$.
:::

::: text-sm
~~~ python {.run}
from sympy import *
def polar(z):
    a, b = re(z), im(z)
    r = sqrt(a**2 + b**2)
    if a == 0:
        theta = pi/2 if b > 0 else -pi/2
    else:
        theta = atan(b / a)
        if a < 0:
            theta += pi if b >= 0 else -pi
    return Mul(r, exp(I*theta, evaluate=False), evaluate=False)

z = 2 * sqrt(3) - 2*I
w = -1 + I
polar(z) # Changez ici
~~~
:::

# Exercice H.36 {.w-1--2}

::: exercise
Calculez $(1 - i)^8$ à l'aide de la forme exponentielle.
:::

~~~ python {.run}
from sympy import *
simplify((1 - I) ** 8)
~~~

# Exercice H.38, H.40 {.w-1--2}

::: exercise
Déterminez les racines $n$-èmes.
Esquissez les solutions sur le plan complexes:

- $z^5 = 32$
- $z^3 = 1 + i$
:::

::: hint
Écrivez le second membre sous la forme exponentielle.
:::

# Réponses

<Iframe class="w-full h-full" src="/documents/pm1c-answers.pdf#page=10" />
