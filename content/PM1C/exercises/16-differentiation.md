---
title: Dérivées II
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="Exercice 2.4.19"}
Dérivez $y = \frac {t \sin t} {1 + t}$
:::

::: {.exercise title="Exercice 2.6.31"}
Trouvez une équation de la tangente de $x^2 + y^2 = (2x^2 + 2y^2 - x)^2$ en $(0, \frac 1 2)$ via la dérivation implicite
:::

::: {.exercise title="Exercice 2.7: 1, 2"}
![](/images/exercises/2.7.1.png){.w-1--2}

1. $f(t) = t^3 - 8t^2 + 24t$
2. $f(t) = \frac {9t} {t^2 + 9}$
:::

::: {.exercise title="Exercice 2.9.6"}
Trouvez l'approximation linéaire de $g(x) = \sqrt[3]{1 + x}$ en $a = 0$,
et utilisez-là pour estimer $\sqrt[3]{0.95}$ et $\sqrt[3]{1.1}$.
Illustrez en dessinant le graphe de $g$ et de sa tangente.
:::

::: {.exercise title="Exercice 3.1.5"}
![](/images/exercises/3.1.5.png){.w-1--2}

Utilisez le graphe pour trouvez les extremas absolus et locaux de la fonction.
:::

# Exercice 2.4.40 {.w-1--2}

::: exercise
Trouvez les points de la courbe $y = \frac {\cos x} {2 + \sin x}$ pour lesquels
la tangente est horizontale.
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
y = cos(x) / (2 + sin(x))
solveset(y.diff(x))
~~~

~~~ yaml {.plot}
data:
  - fn: cos(x) / (2 + sin(x))
~~~

# Exercice 2.6.33 {.w-1--2}

::: exercise
En utilisant la dérivée implicite, calculez $\frac {\dd y} {\dd x}$ pour
les expressions équivalentes
$$
\frac x y = y^2 + 1,
\quad
x = y^3 + y,
\quad y \neq 0
$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
y = Function("y")(x)

# Changez cette ligne
eq = Eq(x, y**3 + y)

eq = Eq(eq.args[0].diff(x), eq.args[1].diff(x))
y_x = solve(eq, y.diff(x))[0]
~~~

# Exercice 2.9.10 {.columns-2}

::::: break-inside-avoid-column
::: exercise
Vérifiez que l'approximation linéaire de $\tan x$ en $a = 0$ est donnée par $y = x$.
Ensuite, déterminez les valeurs de $x$ pour lesquelles la valeur de l'approximation est valable au dixième près.
:::

~~~ python {.run}
from sympy import *
x = Symbol("x", real=True)
f = tan(x)
L = f.subs({x: 0}) + f.diff(x).subs({x: 0}) * x
~~~
:::::

~~~ yaml {.plot}
width: 800
height: 600
data:
  - fn: tan(x)
  - fn: tan(x) + 0.1
  - fn: tan(x) - 0.1
  - fn: x
~~~

# Exercice 2.9.44 {.w-1--2}

::: exercise
Un côté d'un triangle rectangle mesure $20$ cm et son angle opposé est $30^\circ$,
avec une erreur possible de $\pm 1^\circ$.

a. Utilisez la différentiell pour estimer l'erreur sur la longueur de l'hypothénuse
b. Quelle est le pourcentage sur l'erreur?
:::

~~~ python {.run}
from sympy import *
theta = Symbol("theta")
h = 20 / sin(theta * pi / 180)
dtheta = 1
dh = h.diff(theta).subs({theta: 30}) * dtheta
[dh, dh/h.subs({theta: 30})]
~~~

# Exercice 3.2.29 {.w-1--2}

::: exercise
Si $f(1) = 10$ et $f'(x) \geq 2$ pour $1 \leq x \leq 4$,
quelle serait la valeur minimale de $f(4)$?
:::

~~~ python {.run}
10 + 2 * 3
~~~