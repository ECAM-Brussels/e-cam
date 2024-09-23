---
title: Vecteurs II
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="Exercices 8, 10 p. 891"}
Calculez $\vec a \cdot \vec b$ lorsque

- $\vec a = 3 \vec i + 2 \vec j - \vec k$ et $\vec b = 4 \vec i + 5 \vec k$
- $\|\vec a\| = 80$, $\|\vec b\| = 50$, $\theta = 3 \pi / 4$
:::

::: {.exercise title="Exercice 15 p. 891"}
Trouvez l'angle entre $\vec u = (5, 1)$ et $\vec v = (3, 2)$.
:::

::: {.exercise title="Exercice 25 p. 891"}
Utilisez les vecteurs pour déterminer
si le triangle formé par les sommets $P(1, -3, -2)$, $Q(2, 0, -4)$ et $R(6, -2, -5)$ est rectangle.
:::

::: {.exercise title="Exercise 51 p. 891"}
Une luge est tirée le long d'un chemin par une corde.
Une force de $30$ N agissant à un angle de $40^\circ$ par rapport à l'horizontale
bouge la luge de $80$ m.
Calculez le travail effectué par cette force.
:::

# Exercice 20 {.w-1--2}

$$
\cos \theta = \frac {\vec v \cdot \vec w} {\|\vec v\| \|\vec w\|}
$$

::: exercise
Trouvez l'angle entre les vecteurs $\vec a = 8 \vec i - \vec j + 4 \vec k$ et $\vec b = 4\vec j + 2 \vec k$.
:::

~~~ python {.run}
from sympy import *
a = Matrix([8, -1, 4])
b = Matrix([0, 4, 2])
theta = acos(a.dot(b) / sqrt(a.dot(a) * b.dot(b)))
# Conversion en degrés
theta = theta * 180 / pi
theta.evalf()
~~~

::: hint
Exemple similaire: exemple 5 p. 888
:::

# Exercice 37 {.w-1--2}

::: {.definition title="Cosinus directeurs"}
$$
(
  \cos \underbrace{\theta_1}_{\measuredangle(\vec v, \vec i)},
  \cos \underbrace{\theta_2}_{\measuredangle(\vec v, \vec j)},
  \cos \underbrace{\theta_3}_{\measuredangle(\vec v, \vec k)}
)
$$
:::

::: exercise
Trouvez les cosinus directeurs du vecteur $(c, c, c)$ où $c > 0$.
:::

~~~ python {.run}
from sympy import *
c = Symbol("c", positive=True)
v = Matrix([c, c, c])
i, j, k = Matrix([1, 0, 0]), Matrix([0, 1, 0]), Matrix([0, 0, 1])
cosines = [v.dot(w)/sqrt(v.dot(v)) for w in [i, j, k]]
angles = [N(acos(c) * 180 / pi) for c in cosines]
# Changez à 'angles' pour voir les angles
cosines
~~~

::: hint
Voir exemple 5 pp. 888-889.
:::

# Exercice 44 {.columns-2}

::::: break-inside-avoid-column
::: definition
$$
\mathrm{proj}_{\vec a}(\vec b) = \frac {\vec a \cdot \vec b} {\|\vec a\|^2} \vec a
\quad \text{projection de } \vec b \text{ sur } \vec a.
$$
:::

::: exercise
Trouvez la projection de $\vec b = 5 \vec i - \vec k$ sur $\vec a = \vec i + 2 \vec j + 3 \vec k$
:::

~~~ python {.run}
from sympy import *
a = Matrix([1, 2, 3])
b = Matrix([5, 0, -1])
proj = a.dot(b) / a.dot(a) * a
~~~

::: hint
Exemple similaire: exemple 6 p. 889
:::
:::::

![](/images/projection.png)

# Exercice 53 {.w-1--2}

::: exercise
En utilisant la projection, montrez que la distance entre un point $P(x_1, y_1)$ et une droite $ax + by + c = 0$ est donnée par
$$
\frac {|ax_1 + by_1 + c|} {\sqrt {a^2 + b^2}}
$$

Utilisez ensuite cette formule pour trouver la distance entre $(-2, 3)$ et $3x - 4y + 5 = 0$.
:::

::: hint
Le vecteur $(a, b)$ est perpendiculaire à la droite.
:::

~~~ python {.run}
from sympy import *
x1, x2 = -2, 3
a, b, c = 3, -4, 5
dist = Abs((a*x1 + b*x2 + c) / sqrt(a**2 + b**2))
~~~

# Exercice 56 {.w-1--2}

::: exercise
Trouvez l'angle, en degrés arrondis à une décimale,
entre la diagonale d'un cube et la diagonale d'une de ses faces.
:::

::: hint
Prenez un cube particulier dans un repère (le plus simple possible),
et faites les calculs sur ce cube
:::

~~~ python {.eval}
from sympy import *
v, w = Matrix([1, 1, 1]), Matrix([1, 0, 1])
angle = acos(v.dot(w) / sqrt(v.dot(v) * w.dot(w))) * 180 / pi
angle.evalf()
~~~

# Exercice 57 {.w-1--2}

::: exercise
Une molécule de méthane ($CH_4$) est structurée avec quatre atomes d'hydrogène aux sommets d'un tétraèdre régulier.
L'atome de carbone se situe au centre de masse de ce tétraèdre.
L'*angle de liaison* est l'angle formé par $H-C-H$.
Montrez qu'il vaut environ $109.5^\circ$.
:::

::: hint
![](/images/exercises/12.3.57.png){.w-96 .block .m-auto}
Placez vous dans un repère où les atomes d'hydrogène ont pour coordonnées
$$
(1, 0, 0), \quad (0, 1, 0), \quad (0, 0, 1), \quad (1, 1, 1).
$$
Le centre de masse aura alors pour coordonnées $(1/2, 1/2, 1/2)$.
:::