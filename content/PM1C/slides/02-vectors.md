---
title: Vecteurs
slideshow: true
---

# Rappels {.w-1--2}

1. Addition (loi du parallélogramme)
   ![](/images/vector_addition.svg){.block .m-auto .h-60}
2. Multiplication scalaire
   ![](/images/vector_scalar_multiplication.svg){.block .m-auto .h-60}
3. Soustraction: $\vec a - \vec b$
4. Relation de Chasles $\vec {PR} = \vec {PQ} + \vec {QR}$
   ![](/images/chasles.svg){.block .m-auto .h-60}

# Composantes d'un vecteur p. 876 {.w-1--2}

Soient $A(x_A, y_A, z_A)$, $B(x_B, y_B, z_B)$.

$$
\vec {AB} = (x_B - x_A, y_B - y_A, z_B - z_A)
$$

::: example
Trouvez le vecteur reliant $A(2, -3, 4)$ à $B(-2, 1, 1)$.
:::

~~~ python {.run}
from sympy import *
A = Matrix([2, -3, 4])
B = Matrix([-2, 1, 1])
AB = B - A
~~~

# Norme p. 877 {.w-1--2}

::: {.definition title="Norme"}
La **norme** de $\vec a = (a_1, a_2, a_3)$ est donnée par
$$
\|\vec a\| = \sqrt{a_1^2 + a_2^2 + a_3^2}
$$
:::

::: example
Si $\vec a = (4, 0, 3)$, calculez sa norme.
:::

~~~ python {.run}
from sympy import *
a = Matrix([4, 0, 3])
norm = sqrt(a.dot(a))
~~~

# Somme et multiplication scalaire p. 878 {.w-1--2}

Soient $\vec a = (a_1, a_2, a_3)$ et $\vec b = (b_1, b_2, b_3)$.

$$
\vec a \pm \vec b = (a_1 \pm b_1, a_2 \pm b_2, a_3 \pm b_3)\\
c \vec a = (c a_1, c a_2, c a_3)
$$

::: example
Si $\vec a = (4, 0, 3)$ et $\vec b = (-2, 1, 5)$,
trouve les vecteurs $\vec a + \vec b$, $\vec a - \vec b$, $3 \vec b$, $2 \vec a + 5 \vec b$.
:::

~~~ python {.run}
from sympy import *
a = Matrix([4, 0, 3])
b = Matrix([-2, 1, 5])
a + b
~~~

# Base canonique p. 879 {.w-1--2}

::: {.definition title="Base canonique"}
$$
\vec i = (1, 0, 0), \quad
\vec j = (0, 1, 0), \quad
\vec k = (0, 0, 1)
$$
:::

$$
(a_1, a_2, a_3) = a_1 \vec i + a_2 \vec j + a_3 \vec k
$$

::: example
Si $\vec a = \vec i + 2 \vec j - 3 \vec k$ et $\vec b = 4 \vec i + 7 \vec k$,
exprime le vecteur $2 \vec a + 3 \vec b$ en termes de $\vec i, \vec j, \vec k$.
:::

~~~ python {.run}
from sympy import *
i = Matrix([1, 0, 0])
j = Matrix([0, 1, 0])
k = Matrix([0, 0, 1])
a = i + 2*j - 3*k
b = 4*i + 7*k
2*a + 3*b
~~~

# Vecteur unitaire p. 880 {.w-1--2}

::: {.definition title="Vecteur unitaire"}
Le **vecteur unitaire** associé à un vecteur *non-nul* $\vec a$ est
$$\frac {\vec a} {\| \vec a \|}$$
:::

::: example
Trouvez le vecteur unitaire dans la direction $2 \vec i - \vec j - 2 \vec k$.
:::

~~~ python {.run}
from sympy import *
a = Matrix([2, -1, 2])
norm = sqrt(a.dot(a))
unit = a / norm
~~~

::: remark
Exercices sur la [plateforme](/skills/geometry/vectors/unit-vector)
:::

# Produit scalaire: visualisation

<Geogebra id="G2yWterN" />

- produit scalaire négatif: angle obtus
- produit scalair nul: angle droit
- produit scalaire positif: angle aigu

# Produit scalaire en coordonnées cartésiennes {.w-1--2}

::: {.proposition title="Produits scalaires canoniques"}
$$
\vec i \cdot \vec i = 1, \quad \vec i \cdot \vec j = 0, \quad \vec i \cdot \vec k = 0\\
\vec j \cdot \vec i = 0, \quad \vec j \cdot \vec j = 1, \quad \vec j \cdot \vec k = 0\\
\vec k \cdot \vec i = 0, \quad \vec k \cdot \vec j = 0, \quad \vec k \cdot \vec k = 1
$$
:::

Sachant que le produit scalaire se distribue
comme la multiplication classique,
on montre que

::: {.definition title="Produit scalaire en coordonnées cartésiennes"}
$$
\begin{pmatrix}
x_1 \\ y_1 \\ z_1
\end{pmatrix}
\cdot
\begin{pmatrix}
x_2 \\ y_2 \\ z_2
\end{pmatrix}
= x_1 x_2 + y_1 y_2 + z_1 z_2
$$
:::

# Norme {.w-1--2}

$$
\vec a =
\begin{pmatrix}
a_1 \\ a_2 \\ a_3
\end{pmatrix}
\quad \implies \quad
\vec a \cdot \vec a
= a_1^2 + a_2^2 + a_3^2
$$

::: {.definition title="Norme d'un vecteur"}
$$
\|\vec a\| = \vec a \cdot \vec a
$$
:::

::: remark
- La norme n'est rien d'autre que la **longueur** d'un vecteur.
- Exercices sur la [plateforme](/skills/geometry/vectors/norm)
:::

# Produit scalaire p. 885 {.w-1--2}

![](/images/dot_product.svg){.block .m-auto .h-72}

::: {.definition title="Produit scalaire (point de vue géométrique)"}
$$
\vec a \cdot \vec b = \|\vec a\| \|\vec b\| \cos \theta
$$
:::

# Produit scalaire: exemples p. 885 {.w-1--2}

::: example
$$
(-1, 7, 4) \cdot (6, 2, -1/2) = \dots
\qquad
(\vec i + 2 \vec j - 3 \vec k) \cdot (2 \vec j - \vec k) = \dots
$$
:::

~~~ python {.run}
from sympy import *
Matrix([-1, 7, 4]).dot(Matrix([6, 2, -1/2]))
~~~

~~~ python {.run}
from sympy import *
Matrix([1, 2, -3]).dot(Matrix([0, 2, -1]))
~~~

::: remark
Exercices sur la [plateforme](/skills/geometry/vectors/dot-product)
:::

# Angle entre deux vecteurs p. 887 {.w-1--2}

::::: {.flex .justify-center .items-center .gap-4}
![](/images/dot_product.svg){.block .m-auto .h-44}

$$
\vec v \cdot \vec w = \|\vec v\| \|\vec w\| \cos \theta
\implies
\boxed{
  \cos \theta = \frac {\vec v \cdot \vec w} {\|\vec v\| \|\vec w\|}
}
$$
:::::

::: example
Trouvez l'angle entre $\vec a = (2, 2, -1)$ et $\vec b = (5, -3, 2)$
:::

~~~ python {.run}
from sympy import *
a = Matrix([2, 2, -1])
b = Matrix([5, -3, 2])
cosine = a.dot(b) / sqrt(a.dot(a) * b.dot(b))
theta = acos(cosine).evalf()
~~~

::: remark
Plus d'exercices sur la [plateforme](/skills/geometry/vectors/angle)
:::

# Perpendicularité p. 887 {.w-1--2}

::: proposition
Deux vecteurs $\vec a$, $\vec b$ sont orthogonaux
ssi $\vec a \cdot \vec b = 0$.
:::

::: example
Montrez que $2 \vec i + 2 \vec j - \vec k$ est perpendiculaire à $5 \vec i - 4 \vec j + 2 \vec k$.
:::

~~~ python {.run}
from sympy import *
a, b = Matrix([2, 2, -1]), Matrix([5, -4, 2])
a.dot(b)
~~~

# Produit vectoriel: introduction {.w-1--2}

<Geogebra id="mkzzm8hh" height={475} />

- $\vec u \times \vec v \perp \vec u, \vec v$
- norme: aire du parallélogramme engendré par $\vec u$ et $\vec v$
- direction: règle main droite

![](/images/right-hand_rule.png){.h-52 .block .m-auto}

# Produit vectoriel: base canonique {.w-1--2}

::: proposition
$$
\vec i \times \vec j = \vec k, \quad
\vec j \times \vec k = \vec i, \quad
\vec k \times \vec i = \vec j
$$

$$\vec a \times \vec a = \vec 0$$

$$\vec a \times \vec b = -\vec b \times \vec a$$
:::

Sachant que le produit vectoriel se distribue
comme la multiplication classique,
on montre que

::: {.definition title="Produit scalaire en coordonnées cartésiennes"}
$$
\begin{pmatrix}
a_1 \\ a_2 \\ a_3
\end{pmatrix}
\times
\begin{pmatrix}
b_1 \\ b_2 \\ b_3
\end{pmatrix} =
\begin{pmatrix}
a_2 b_3 - a_3 b_2\\
a_3 b_1 - a_1 b_3\\
a_1 b_2 - a_2 b_1
\end{pmatrix}
$$
:::

# Produit vectoriel p. 893 {.w-1--2}

::: {.definition title="Produit vectoriel"}
$$
\vec a \times \vec b =
\begin{pmatrix}
a_2 b_3 - a_3 b_2\\
a_3 b_1 - a_1 b_3\\
a_1 b_2 - a_2 b_1
\end{pmatrix}
\qquad
\vec a = (a_1, a_2, a_3),\ \vec b = (b_1, b_2, b_3)
$$
:::

::: remark
Exercez-vous sur [la plateforme](/skills/geometry/vectors/cross-product).
:::

::: example
Soit $\vec a = (1, 3, 4)$ et $\vec b = (2, 7, -5)$.
Calculez $\vec a \times \vec b$.
:::

~~~ python {.run}
from sympy import *
a = Matrix([1, 3, 4])
b = Matrix([2, 7, -5])
a.cross(b)
~~~

# Perpendicularité p. 895 {.w-1--2}

::: proposition
$\vec a \times \vec b$ est orthogonal à $\vec a$ et $\vec b$.
:::

::: {.example title="Exemple 3 p. 896"}
Trouvez un vecteur perpendiculaire au plan passant par $P(1, 4, 6)$, $Q(-2, 5, -1)$ et $R(1, -1, 1)$.
:::

~~~ python {.run}
from sympy import *
P = Matrix([1, 4, 6])
Q = Matrix([-2, 5, -1])
R = Matrix([1, -1, 1])
(Q - P).cross(R - P)
~~~

# Aire du parallélogramme p. 895 {.w-1--2}

::: proposition
$$
\|\vec a \times \vec b\| = \|\vec a\| \|\vec b\| \sin \theta,
\qquad 0 \leq \theta \leq \pi
$$
:::

::: {.example title="Exemple 4 p. 897"}
Trouvez l'aire du triangle dont les sommets sont $P(1, 4, 6)$, $Q(-2, 5, -1)$ et $R(1, -1, 1)$.
:::

~~~ python {.run}
from sympy import *
P = Matrix([1, 4, 6])
Q = Matrix([-2, 5, -1])
R = Matrix([1, -1, 1])
n = (Q - P).cross(R - P)
area = sqrt(n.dot(n)) / 2
~~~

# Volume de parallélépipède p. 898 {.w-3--5}

::::: {.flex .justify-center .items-center .gap-4}
![](/images/parallelepiped_volume.svg){.h-36}

$$
V = \left|\vec a \cdot (\vec b \times \vec c)\right|
$$
:::::

::: example
Montrez que $\vec a = (1, 4, -7)$, $\vec b = (2, -1, 4)$ et $\vec c = (0, -9, 18)$ sont coplanaires.
:::

~~~ python {.run .text-sm}
from sympy import *
a = Matrix([1, 4, -7])
b = Matrix([2, -1, 4])
c = Matrix([0, -9, 18])
a.dot(b.cross(c))
~~~

::: remark
Exercices sur la [plateforme](/skills/geometry/vectors/triple-product)
:::

# Exercices supplémentaires {.w-1--2}

<Iframe class="w-full h-full" src="https://pmt.physicsandmathstutor.com/download/Maths/A-level/FP3/Topic-Qs/Edexcel-Set-2/Ch.5%20Vectors.pdf" />
