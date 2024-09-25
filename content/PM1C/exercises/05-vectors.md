---
title: Vecteurs III
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="Exercice 1 p. 899"}
Calculez $\vec a \times \vec b$ et vérifiez
que ce vecteur est orthogonal à $\vec a$ et $\vec b$,
avec $\vec a = (2, 3, 0)$ et $\vec b = (1, 0, 5)$.
:::

::: {.exercise title="Exercice 9p. 899"}
Calculez $(\vec i \times \vec j) \times \vec k$ sans faire de calculs.
:::

::: {.exercise title="Exercice 13 p. 900"}
Ces expressions ont-elles un sens?

::::: columns-2
a. $\vec a \cdot (\vec b \times \vec c)$

b. $\vec a \times (\vec b \cdot \vec c)$

c. $\vec a \times (\vec b \times \vec c)$

d. $\vec a \cdot (\vec b \cdot \vec c)$

e. $(\vec a \cdot \vec b) \times (\vec c \cdot \vec d)$

f. $(\vec a \times \vec b) \cdot (\vec c \times \vec d)$
:::::
:::

::: {.exercise title="Exercice 14 p. 900"}
Trouvez $\|\vec u \times \vec v\|$ et déterminez si $\vec u \times \vec v$ pointe dans la page ou hors de la page.
![](/images/exercises/12.4.14.png){.w-70 .block .m-auto}
:::

::: {.exercise title="Exercice 27 p. 900"}
Trouvez l'aire du parallélogramme dont les sommets sont
$$A(-3, 0) \quad B(-1, 3) \quad C(5, 2) \quad D(3, -1)$$
:::

::: {.exercise title="Exercice 35 p. 900"}
Trouvez le volume du parallélépipède qui a pour arrêtes adjacentes $PQ$, $PR$ et $PS$:
$$
P(-2, 1, 0) \quad Q(2, 3, 2) \quad R(1, 4, -1) \quad S(3, 6, 1).
$$
:::

# Exercices 8 et  12 {.w-1--2}

::: exercise
Soient $\vec a = \vec i - 2 \vec k$ et $\vec b = \vec j + \vec k$.
Calculez $\vec a \times \vec b$ et esquissez $\vec a$, $\vec b$ et $\vec a \times \vec b$.
:::

![](/images/cross_product_properties.png){.block .m-auto}

::: exercise
Calculez $(\vec i + \vec j) \times (\vec i - \vec j)$ en n'utilisant que les propriétés ci-dessus.
:::

# Exercice 15 {.w-1--2}

::: {.exercise title="Exercice 15 p. 900"}
Trouvez $\|\vec u \times \vec v\|$ et déterminez si $\vec u \times \vec v$ pointe dans la page ou hors de la page.
![](/images/exercises/12.4.15.png){.w-70 .block .m-auto}
:::

~~~ python {.eval}
from sympy import *
12 * 16 * sin(120 * pi / 180)
~~~

rentrant dans la page.

# Exercice 31 p. 900 {.w-1--2}

::: exercise
Soient $P(7, -2, 0)$, $Q(3, 1, 3)$ et $R(4, -4, 2)$.

a. Trouvez un vecteur non nul et orthogonal au plan contenant ces trois points.
b. Trouvez l'aire du triangle PQR.
:::

::: hint
- Pour le point a, voir exemple 3 p. 896
- Pour le point b, voir exemple 4 p. 897
:::

~~~ python {.eval}
from sympy import *
P = Matrix([7, -2, 0])
Q = Matrix([3, 1, 3])
R = Matrix([4, -4, 2])
n = (Q - P).cross(R - P)
n
~~~

~~~ python {.eval}
from sympy import *
P = Matrix([7, -2, 0])
Q = Matrix([3, 1, 3])
R = Matrix([4, -4, 2])
n = (Q - P).cross(R - P)
sqrt(n.dot(n)) / 2
~~~

# Exercice 38 {.w-1--2}

::: exercise
A l'aide du produit mixte,
déterminez si les points $A(1, 3, 2)$, $B(3, -1, 6)$, $C(5, 2, 0)$ et $D(3, 6, -4)$ sont coplanaires.
:::

~~~ python {.run}
from sympy import *
A = Matrix([1, 3, 2])
B = Matrix([3, -1, 6])
C = Matrix([5, 2, 0])
D = Matrix([3, 6, -4])
(B - A).dot((C - A).cross(D - A))
~~~

::: hint
Voir exemple 5 p. 898 pour un exercice similaire.
:::

# Exercice 43 p. 901 {.w-1--2}

::: exercise
Si $\vec a \cdot \vec b = \sqrt 3$ et $\vec a \times \vec b = (1, 2, 2)$,
trouvez l'angle entre $\vec a$ et $\vec b$.
:::

::: hint
Essayez de trouver une expression pour $\sin \theta$ et $\cos \theta$.
:::

::::: text-sm
Réponse en degrés:

~~~ python {.eval}
from sympy import *
theta = atan(sqrt(1 + 2**2 + 2**2) / sqrt(3)) * 180 / pi
theta
~~~
:::::

# Exercise 44 {.w-1--2}

::: exercise
Trouvez tous les vecteurs $\vec v$ tels que
$$
\begin{pmatrix}1\\ 2\\ 1\end{pmatrix} \times \vec v
=
\begin{pmatrix}3\\ 1\\ -5\end{pmatrix}.
$$

Expliquez pourquoi il ne peut y avoir de vecteur $\vec v$ tel que
$$
\begin{pmatrix}1\\ 2\\ 1\end{pmatrix} \times \vec v
=
\begin{pmatrix}3\\ 1\\ 5\end{pmatrix}.
$$
:::

~~~ python {.run}
from sympy import *
a, b, c = symbols("a b c")
v = Matrix([a, b, c])
eq = Eq(Matrix([1, 2, 1]).cross(v), Matrix([3, 1, -5]))
solve(eq)
~~~