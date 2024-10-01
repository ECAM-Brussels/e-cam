---
title: Nombres complexes
slideshow: true
---

# Nombres complexes {.w-1--2} 

Un nombre complexe s'écrit
$$
z = a + b i,
\qquad a, b \in \mathbb R.
$$

On notera l'ensemble des nombres complexes $\mathbb C = \{a + bi | a, b \in \mathbb R\}$.

Les règles algébriques usuelles s'appliquent
si ce n'est qu'en plus $\boxed{i^2 = -1}$.

::: {.example title="Exemple 1 p. A57"}
Développez et simplifiez $(-1 + 3i) (2 - 5i)$.
:::

~~~ python {.run}
from sympy import *
expand((-1 + 3*I) * (2 - 5*I))
~~~

# Plan de Gauss {.w-1--2}

On identifie le nombre complexe $a + bi$ au vecteur $(a, b)$.
En particulier, cela permet de placer un nombre complexe sur le plan $\mathbb R^2$.

~~~ yaml {.plot}
height: 600
width: 800
data:
  - fnType: vector
    vector: [3, 4]
    graphType: polyline
  - graphType: text
    location: [3.2, 3.8]
    text: (a, b)
~~~

::: remark
Dans le plan de Gauss,
une multiplication par $i$ revient à une **rotation** de $90^\circ$ dans le sens anti-horloger.
:::

# Complexe conjugué {.w-1--2}

::: definition
Le **complexe conjugué** de $a + bi$, noté $\overline{a + b i}$, est $a - bi$.
:::

~~~ yaml {.plot}
height: 480
width: 640
data:
  - fnType: vector
    vector: [3, 4]
    graphType: polyline
  - fnType: vector
    vector: [3, -4]
    graphType: polyline
~~~

::: remark
La conjugaison correspond à une réflexion par rapport à l'axe $x$.
:::

# Propriétés de la conjugaison et module {.w-1--2}

::: proposition
$$
\overline{z + w} = \overline{z} + \overline{w} \\
\overline{z w} = \overline{z} \overline{w}
$$
$$
z = a + bi \quad \implies \quad z \overline z = a^2 + b^2
$$
:::

::: {.definition title="Module d'un nombre complexe"}
Soit $z = a + bi$.
On définit son module, noté $|z|$, via
$$
|z| = \sqrt{a^2 + b^2} = \sqrt{z \overline z}
$$
:::

# Division complexe {.w-1--2}

::: {.example title="Exemple 2 p. A57"}
Exprimez le nombre $\frac {-1 + 3i} {2 + 5i}$ sous la forme $a + bi$.
:::

~~~ python {.run}
from sympy import *
simplify((-1 + 3*I) / (2 + 5*I))
~~~

# Racine carrée {.w-1--2}

::: {.example title="Exemple 3 p. A58"}
Résoudre l'équation suivante dans $\mathbb C$.
$$z^2 + z + 1 = 0$$
:::

~~~ python {.run}
from sympy import *
z = Symbol("z")
solveset(z**2 + z + 1)
~~~

# Forme polaire p. A59 {.w-1--2}


::::: {.flex .items-center .justify-between}
![](/images/complex_polar_form.svg){.w-64}

$$
\begin{cases}
r^2 = a^2 + b^2\\
\tan \theta = \frac {b} {a}
\end{cases}
\qquad
\Leftrightarrow
\qquad
\begin{cases}
a = r \cos \theta\\
b = r \sin \theta
\end{cases}
$$
:::::

::: warning
L'équation $\tan \theta = \frac b a$ a **plusieurs solutions possibles**.
Et si $a = 0$?
:::

::: {.remark title="Interprétation de la multiplication complexe"}
Multiplier par $z = a + b i = r(\cos \theta + i \sin \theta)$ revient à

- une homothétie d'un facteur $r$
- une rotation d'angle $\theta$
:::

# Formule d'Euler {.w-1--2}

::: {.proposition title="Formule d'Euler"}
$$
e^{i \theta} = \cos \theta + i \sin \theta
$$
:::

::: remark
- La formule d'Euler unifie la trigonométrie et l'exponentiation
- On appelera dorénavant $r e^{i \theta}$ la *forme polaire*.
:::

# Forme polaire: exemples {.w-1--2}

::: {.example title="Exemple 4 p. A59"}
Ecrivez $z = 1 + i$ et $w = \sqrt 3 - i$ sous forme polaire.
:::

::: {.example title="Exemple 5 p. A60"}
Trouvez le produit des nombres complexes $1 + i$ et $\sqrt 3 - i$ sous forme polaire.
:::

~~~ python {.run}
from sympy import *
z = 1 + I # Changez la valeur ici
a, b = re(z), im(z)
r = sqrt(a**2 + b**2)
if a == 0:
    theta = pi/2 if b > 0 else -pi/2
else:
    theta = atan(b / a)
    if a < 0:
        theta += pi if b >= 0 else -pi
expr = Mul(r, exp(I*theta), evaluate=False)
~~~

# Puissances {.w-1--2}

Certaines opérations comme les **calculs d'exposant** (y compris les racines $n$-èmes) sont nettement plus faciles en forme polaire.

::: {.example title="Exemple 6 p. A61"}
Calculez $\left(\frac 1 2 + \frac i 2\right)^{10}$
:::

~~~ python {.run}
from sympy import *
simplify(((1 + I) / 2) ** 10)
~~~

::: {.example title="Exemple 7 p. A62"}
Calculez les 6 solutions de $z^6 = -8$ et
représentez-les sur le plan de Gauss.
:::