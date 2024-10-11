---
title: Dérivées
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="2.1.17"}
![](/images/exercises/2.1.17.png)
:::

::: {.exercise title="2.1.24"}
Par la définition de dérivée,
calculez $f'(a)$ sachant que $f(t) = t^3 - 3t$.
:::

::: {.exercise title="2.2.41"}
Trouvez les points où la fonction n'est pas dérivable.

![](/images/exercises/2.2.41.png)
:::

# Préparation partie II {.columns-2}

::: {.exercise title="2.2.47"}
![](/images/exercises/2.2.47.png)
:::

::: {.exercise title="2.3.13"}
Dérivez $g(x) = \frac 1 {\sqrt{x}} + \sqrt[4]{x}$
:::

::: {.exercise title="2.3.65"}
Trouvez la tangente de la courbe $y = \frac 1 {1 + x^2}$ au point $(-1, \frac 1 2)$.
:::

# Exercice 2.1.28 {.w-1--2}

::: {.exercise title="Exercice 2.1.28"}
Trouvez une équation de la tangente au graphe $y = g(x)$ en $x = 5$ si $g(5) = -3$ et $g'(5) = 4$.
:::

~~~ python {.eval}
from sympy import *
x, y = symbols("x y")
Eq(y, 4 * (x - 5) - 3)
~~~

# Exercice 2.1.57 {.w-1--2}

::: {.exercice title="Exercice 2.1.57"}
Détermine si $f'(0)$ existe.
$$
f(x) = \begin{cases}
x \sin \frac 1 x & \text{if } x \neq 0\\
0 & \text{sinon}
\end{cases}
$$
:::

~~~ python {.run}
from sympy import *
h = Symbol("h")
f = lambda x: x**2*sin(1/x) if x != 0 else 0
limit((f(h) - f(0)) / h, h, 0)
~~~

::: question
Qu'en est-il si on remplace $x \sin \frac 1 x$ par $x^2 \sin \frac 1 x$?
:::

# Exercice 2.2.42 {.w-1--2}

::: exercise
Voici le graphe d'une fonction $f$.
Citez, en justifiant, les points auxquels $f$ n'est pas dérivable.

![](/images/exercises/2.2.42.png)
:::

Réponse: $\{-2, 1, 3\}$

# Exercice 2.2.49 {.w-1--2}

::: exercise
La figure ci-dessous montre trois fonctions.
Une est la position d'une voiture,
une est sa vitesse, et la troisième est l'accélération.
Identifiez chaque courbe et justifiez votre réponse.

![](/images/exercises/2.2.49.png)
:::

Réponse: c est la position, b la vitesse.

# Exercice 2.3.63 p. 144 {.w-1--2}

::: exercise
Trouvez l'équation de la tangente et la normale de
$$
y = \frac {3x} {1 + 5x^2}
$$
en $(1, \frac 1 2)$.
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
y = 3 * x / (1 + 5 * x**2)
m = y.diff(x).subs({x: 1})
Eq(Symbol("y"), m * (x - 1) + Rational(1, 2))
~~~

# Exercice 2.3.73 p. 144 {.w-1--2}

::: exercise
L'équation du mouvement d'une particule est $s = t^3 - 3t$,
où $s$ est en mètres et $t$ est en secondes.
Trouvez

a. la vitesse et l'accélération comme fonctions de $t$
b. l'accélération après $2$ secondes
c. l'accélération lorsque la vitesse vaut $0$
:::

::: text-sm
~~~ python {.run}
from sympy import *
t = Symbol("t")
s = t**3 - 3*t
v = s.diff(t)
a = v.diff(t)
t0 = solve(v)[1]
# Réponse du a.
[v, a]
# Réponse du b
# a.subs({t: 2})
# Réponse du c
# a.subs({t: t0})
~~~
:::

# Exercice 2.3.119 p. 147 {.w-1--2}

::: exercise
Évaluez
$$
\lim_{x \to 1} \frac {x^{1000} - 1} {x - 1}
$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
limit((x**(1000) - 1) / (x - 1), x, 1)
~~~