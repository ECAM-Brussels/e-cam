---
title: Limites
slideshow: true
---

# Préparation {.columns-2}


::: {.exercise title="1.6.10"}
Qu'y a-t-il d'incorrect dans l'équation suivante?
$$
\frac {x^2 + x - 6} {x - 2} = x + 3
$$
Dès lors, expliquez pourquoi l'équation
$$
\lim_{x \to 2} \frac {x^2 + x - 6} {x - 2} = \lim_{x \to 2} (x + 3)
$$
est tout de même correcte.
:::

::::: break-inside-avoid-column

::: {.exercise title="Exercices 1.6: 23, 30"}
$$
\lim_{h \to 0} \frac {\sqrt {9 + h} - 3} h
\quad\quad\quad
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
\quad\quad\quad
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

# Exercice 1.6.19 {.w-1--2}

::: exercise
Calculez la limite si elle existe
$$
\lim_{t \to 3} \frac {t^3 - 27} {t^2 - 9}
$$
:::

~~~ python {.run}
from sympy import *
t = Symbol("t")
limit((t**3 - 27) / (t**2 - 9), t, 3)
~~~

# Exercises 1.6: 27, 31

::: exercise
Calculez les limites suivantes

::::: columns-2
:::: column
$$
\lim_{t \to 0} \frac {\sqrt{1 + t} - \sqrt{1 - t}} {t}
$$

~~~ python {.run}
from sympy import *
t = Symbol("t")
f = (sqrt(1 + t) - sqrt(1 - t)) / t
limit(f, t, 0)
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
Calculez les limites ou montrez qu'elles n'existent pas:

$$
\lim_{x \to -\infty} \frac {\sqrt{1 + 4x^6}} {2 - x^3}\\
\phantom{bla}\\
\lim_{x \to -\infty} \left(\sqrt{4x^2 + 3x} + 2x\right)\\
\phantom{bla}\\
\lim_{x \to +\infty}x \sin \frac 1 x
$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
f1 = sqrt(1 + 4*x**6) / (2 - x**3)
f2 = sqrt(4*x**2 + 3*x) + 2*x
f3 = x * sin(1/x)
# Changez f1 en f2
# Pour f3, n'oubliez pas de changer -oo en oo
# (même si ça ne change strictement rien)
limit(f1, x, -oo)
~~~

# Réponses

<Iframe class="w-full h-full" src="/documents/pm1c-answers.pdf#page=13" />