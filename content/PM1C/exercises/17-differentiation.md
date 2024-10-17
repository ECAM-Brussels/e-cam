---
title: Application de la dérivée
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="Exercice 3.5.55"}
Esquissez la courbe $y = \frac {x^3 + 4} {x^2}$ (voir p. 251).
Trouvez l'équation de l'asymptote oblique.
:::

::: {.exercise title="Exercice 3.7.4"}
La somme de deux nombres est $16$.
Quelle est la plus petite valeur possible
pour la somme de leurs carrés?
:::

::: {.exercise title="Exercice 3.7.6"}
Quelle est la distance verticale minimale entre les paraboles $y = x^2 + 1$ et $y = x - x^2$?
:::

::: {.exercise title="Exercice 3.7.13"}
Un.e fermi.er.e veut construire une palissade pour un champ rectangulaire de $15 000$ $\text{m}^2$,
pour ensuite diviser ce champ en deux avec une palissade parallèle à l'un des deux côtés du rectangle.
Comment peut-il ou elle le faire de telle sorte à minimiser le coût de la palissade?
:::

::: {.exercise title="Exercice 3.7.26"}
Trouvez le point sur la courbe $y = \sqrt{x}$ le plus proche de $(3, 0)$.
:::

# Exercice 3.5.59 p. 257 {.columns-2}

::: exercise
Montrez que la courbe $y = \sqrt {4x^2 + 9}$ a deux asymptote obliques: $y = 2x$ et $y = -2x$.
Utilisez ce fait pour esquisser la courbe.
:::

~~~ yaml {.plot}
height: 800
width: 800
data:
  - fn: sqrt(4x^2 + 9)
  - fn: 2x
  - fn: -2x
~~~

# Exercise 3.7.30 {.w-1--2}

::: exercise
Trouvez l'aire du rectangle le plus grand qui peut être inscrit dans l'ellipse
$$
\frac {x^2} {a^2} + \frac {y^2} {b^2} = 1.
$$
:::

~~~ python {.run}
from sympy import *
a, b, x = symbols("a b x", positive=True)
y = b / a * sqrt(a**2 - x**2)
A = 4 * x * y
xmax = solve(A.diff(x), x)[0]
A.subs({x: xmax})
~~~

# Exercise 3.7.40 p. 272 {.w-1--2}

::: exercise
Une fenêtre a la forme d'un rectangle surmontée d'un demi cercle.
Si le périmètre de la fenêtre est $10$m,
trouvez les dimensions de la fenêtre qui permet de faire entrer le plus de lumière.
:::

~~~ python {.run}
from sympy import *
y = lambda x: simplify((10 - x - pi/2*x) / 2)
x = symbols("x", positive=True)
A = x * y(x) + pi * (x / 2) ** 2 / 2
xmax = solve(A.diff(x), x)[0]
[Eq(x, xmax), Eq(Symbol("y"), y(xmax))]
~~~

# Exercise 3.7.60 p. 274274 {.w-1--2}

::: exercise
Trouvez l'équation de la droite passant par $(3, 5)$
qui détermine l'aire la plus petite dans la premier quadrant.
:::

~~~ python {.run}
from sympy import *
m, x, y = symbols("m x y")
eq = Eq(y, m * (x - 3) + 5)
root = solve(eq.subs({y: 0}), x)[0]
y_intercept = eq.subs({x: 0}).rhs
A = root * y_intercept / 2
m_min = solve(A.diff(m))[0]
eq.subs({m: m_min})
~~~

# Exercise 3.7.80 {.columns-2}

::: exercise
Un tuyau en acier est transporté dans un hall qui est large de $3$ mètres.
À la fin du hall se trouve un virage à angle droit qui mène à un hall plus étroit de $2$ m.
Quelle est la longueur du plus grand tuyau qui peut être porté horizontalement autour du coin?

![](/images/exercises/3.7.80.png)
:::

~~~ python {.run}
from sympy import *
theta = Symbol("theta")
L = 3 / sin(theta) + 2 / cos(theta)
theta_min = solve(L.diff(theta))[0]
N(L.subs({ theta: theta_min }))
~~~