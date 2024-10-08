---
title: Limites
slideshow: true
---

# Préparation {.columns-2}

::::: break-inside-avoid-column
::: {.exercise title="Exercices 1.6: 23, 30"}
$$
\lim_{h \to 0} \frac {\sqrt {9 + h} - 3} h
\quad
\lim_{x \to 2} \frac {x^2 - 4x + 4} {x^4 - 3x^2 - 4}
$$
:::

~~~ python {.run}
from sympy import *
h, x = symbols("h x")
limit((sqrt(9 + h) - 3) / h, h, 0)
# Décommentez la ligne suivante pour l'autre réponse
# limit((x**2 - 4*x + 4) / (x**4 - 3*x**2 - 4), x, 2)
~~~
:::::

::::: break-inside-avoid-colum
::: {.exercise title="Exercices 3.4: 12, 19"}
$$
\lim_{t \to -\infty} \frac {6t^2 + t - 5} {9 - 2t^2}
\quad
\lim_{x \to +\infty} \frac {\sqrt{1 + 4x^6}} {2 - x^3}
$$
:::

~~~ python {.run}
from sympy import *
t, x = symbols("t x")
limit((6*t**2 + t - 5) / (9 - 2*t**2), t, oo)
# Décommentez la ligne suivante pour l'autre réponse
# limit(sqrt(1 + 4*x**6) / (2 - x**3), x, oo)
~~~
:::::

# Exercises 1.6: 27, 31

::: exercise
Évaluez les limites suivantes

::::: columns-2
:::: column
$$
\lim_{x \to -2} \frac {x^2 - x - 6} {3x^2 + 5x - 2}
$$

~~~ python {.run}
from sympy import *
x = Symbol("x")
f = (x**2 - x - 6) / (3*x**2 + 5*x - 2)
limit(f, x, -2)
~~~
::::
:::: column
$$
\lim_{t \to 0} \left(\frac 1 {t \sqrt{1 + t}} - \frac 1 t\right)
$$

~~~ python {.run}
from sympy import *
t = Symbol("t")
f = 1 / (t * sqrt(1 + t)) - 1/t
limit(f, t, 0)
~~~
::::
:::::
:::

# Exercice 1.6.68 {.w-1--2}

![](/images/exercises/1.6.68.png){.block .mx-auto}

# Exercices 3.4: 20, 26, 31 {.w-1--2}

::: exercise
Trouvez les limites ou montrez qu'elles n'existent pas:

$$
\lim_{x \to -\infty} \frac {\sqrt{1 + 4x^6}} {2 - x^3}\\
\lim_{x \to -\infty} \left(\sqrt{4x^2 + 3} + 2x\right)
$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
f1 = sqrt(1 + 4*x**6) / (2 - x**3)
f2 = sqrt(4*x**2 + 3) + 2*x
# Changez f1 en f2 pour la deuxième limite,
# La troisième n'existe pas
limit(f1, x, -oo)
~~~