---
title: Dérivées II
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="Exercice 2.4.19"}
Dérivez $y = \frac {t \sin t} {1 + t}$
:::

::: {.exercise title="Exercice 2.5.54"}
Déterminez une équation de la tangente à la courbe $y = \sqrt{1+x^3}$ au point $(2, 3)$.
:::

::: {.exercise title="Exercice 3.1.5"}
Employez le graphe de la fonction pour déterminer ses extremas absolus et locaux.
![](/images/exercises/3.1.5.png){style="width: 40%; margin: 0;"}
:::


::: {.exercise title="Exercice 2.7: 1"}
![](/images/exercises/2.7.1.png){style="width: 80%; margin: 0;"}

1. $f(t) = t^3 - 9t^2 + 24t$
:::



# Exercice 2.4.40 {.w-1--2}

::: exercise
Déterminez les points de la courbe $y = \frac {\cos x} {2 + \sin x}$ pour lesquels
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

# Exercice 2.5.57a {.w-1--2}

::: exercise
Déterminez une équation de la tangente à la courbe $y = \tan(\pi x^2/4)$ au point $(1, 1)$.
:::


# Exercice 2.7.2 {.columns-2}

::: {.exercise title="Exercice 2.7: 2"}
![](/images/exercises/2.7.1.png){style="width: 80%; margin: 0;"}

2. $f(t) = \cfrac {9t} {t^2 + 9}$
:::

# Exercice 3.2.29 {.w-1--2}

::: exercise
Si $f(1) = 10$ et $f'(x) \geq 2$ pour $1 \leq x \leq 4$,
quelle serait la valeur minimale de $f(4)$?
:::

~~~ python {.run}
10 + 2 * 3
~~~

# Exercice 3.5.47 {.w-1--2}

::: exercise
La figure ci-dessous représente une poutre de longueur $L$, encastrée dans des
murs en béton. Si une charge constante $W$ est répartie uniformément
sur toute sa longueur, la poutre prend la forme de la courbe de
déflexion

$$
y = -\frac{W}{24EI}x^4
  + \frac{WL}{12EI}x^3
  - \frac{WL^2}{24EI}x^2
$$

où $E$ et $I$ sont des constantes positives. ($E$ est le module
d'élasticité de Young et $I$ est le moment d'inertie d'une section
transversale de la poutre.)

Tracer la courbe de déflexion à l'aide des racines et des signes de la première dérivée.

![](/images/exercises/3.5.47.png){style="width: 60%; margin: 0 auto; display: block;"}

:::


# Réponses

<Iframe class="w-full h-full" src="/documents/pm1c-answers.pdf#page=14" />