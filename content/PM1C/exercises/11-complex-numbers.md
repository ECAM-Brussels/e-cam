---
title: Nombres complexes II
slideshow: true
---

# Préparation {.columns-2}

<Iframe class="w-full h-full" src="/documents/complex-numbers.pdf" />

H:45, suppl*: 3a, 4a, 5, 7c, 8

# Exercice 10 {.w-1--2}

::: exercise
Dans le plan complexe,
déterminez tous les points $z = x + iy$ tels que
$\frac {z - i} {z - 1}$ soit un imaginaire pur non nul.
:::

::: hint
Posez $z = x + i y$ et écrivez l'équation associée à
$$\mathrm{Re}\left(\frac {z - i} {z - 1}\right) = 0$$
:::

~~~ python {.run}
from sympy import *
x, y = symbols("x y", real=True)
z = x + I*y
w = (z - I) / (z - 1)
# La partie réelle doit être nulle
simplify(Eq(re(w), 0))
~~~

# Exercice 11 {.w-1--2}

::: exercise
Soit $z_0 = \cos \frac {2 \pi} 5 + i \sin \frac {2 \pi} 5$.

a. Montrez que $z_0$ est une racine cinquième de l'unité
b. Représentez $1$, $z_0$, $z_0^2$, $z_0^3$, $z_0^4$ dans le plan complexe,
   et déduisez-en que
   $$
   1 + z_0 + z_0^2 + z_0^3 + z_0^4 = 0.
   $$
   Justifiez votre réponse.
c. Montrez que $\alpha = z_0 + z_0^4$ et $\beta = z_0^2 + z_0^3$ sont solution de
   $$X^2 + X - 1 = 0.$$
d. Déterminez $\alpha$ en fonction de $\cos \frac {2 \pi} 5$.
e. Résoudre l'équation $X^2 + X - 1 = 0$ et en déduire la valeur de $\cos \frac {2 \pi} 5$.
:::

# Exercice 12 {.w-1--2}

::: exercise
Soient $z_1, z_2$ deux nombres complexes distincts.
Soit $z = (1 - t) z_1 + t z_2$, avec $0 < t < 1$.
Les identités suivantes sont-elles correctes ou fausses?
Justifiez.

a. $|z - z_1| + |z - z_2| = |z_1 - z_2|$
b. $\arg (z - z_1) = \arg(z - z_2)$
c. $\arg (z - z_1) = \arg(z_2 - z_1)$
d. $$
   \begin{vmatrix}
   z - z_1 & \overline{z - z_1}\\
   z_2 - z_1 & \overline{z_2 - z_1}\\
   \end{vmatrix} = 0.
   $$
:::

# Exercice 13 {.w-1--2}

::: exercise
Déterminez $z \in \mathbb C$ tel que
$$
\mathrm{Re}\left( z (1 - i) \right) + z \overline z = 0
$$
:::