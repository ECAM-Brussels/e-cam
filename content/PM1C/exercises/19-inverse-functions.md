---
title: Fonctions réciproques II
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="6.4.41 p. 449"}
Trouvez l'équation de la tangente à $y = \ln(x^2 - 3x + 1)$ au point $(3, 0)$.
:::

::: {.exercise title="6.4.51 p. 449"}
Dérivez logarithmiquement $y = x^x$
:::

::: {.exercise title="6.6.7"}
Calculez la valeure exacte de $\tan(\sin^{-1}(\frac 2 3))$.
:::

::: {.exercise title="6.6.23"}
Calculez la dérivée $f(x) = \sin^{-1}(5x)$
:::

# Exercise 6.4.42 {.w-1--2}

::: exercise
Trouvez une équation de la tangente à $y = x^2 \ln x$ au point $(1, 0)$.
:::

~~~ python {.run}
from sympy import *
x, y = symbols("x y")
f = x**2 * ln(x)
Eq(y, f.diff(x).subs({x: 1}) * (x - 1) + f.subs({x: 1}))
~~~

# Exercise 6.4.53 {.w-1--2}

::: exercise
Utilisez la dérivation logarithmique pour dérivez $y = x^{\sin x}$.
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
y = x ** sin(x)
simplify(y.diff(x))
~~~

# Exercice 6.6.9 {.w-1--2}

::: exercise
Calculez la valeur exacte de $\cos (2 \sin^{-1}(\frac 5 {13}))$
:::

~~~ python {.run}
from sympy import *
expr = cos(2 * asin(Rational(5, 13)))
trigsimp(expr)
~~~

# Exercice 6.6.24 {.w-1--2}

::: exercise
Calculez la dérivée de $f(x) = \arccos \sqrt x$ et simplifiez.
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
f = acos(sqrt(x))
simplify(f.diff(x))
~~~

# Exercice 6.6.49 {.w-1--2}

::: exercise
Où devrait être choisi le point $P$ sur le segment $AB$ pour maximiser l'angle $\theta$

![](/images/exercises/6.6.49.png){.w-84 .m-auto}
:::

Distance à B:

~~~ python {.run}
from sympy import *
x = Symbol("x")
theta = pi - atan(2/x) - atan(5 / (3 - x))
solve(theta.diff(x))[0]
~~~