---
title: Droites et coniques
slideshow: true
---

# Distance p. A12 {.w-1--2}

::: {.definition title="Distance"}
La distance entre deux points est donnée par
$$
\sqrt {\Delta x^2 + \Delta y^2}
$$
:::

::: {.example title="Exemple 2 p. A12"}
Calculez la distance entre $(1, -2)$ et $(5, 3)$
:::

~~~ python {.run}
from sympy import sqrt
d = sqrt((5 - 1)**2 + (3 - (-2))**2)
~~~

# Pente p. A12 {.w-1--2}

::: {.definition title="Pente"}
La pente d'une droite non-verticale est
$$
m = \frac {\Delta y} {\Delta x}
$$
:::

::: question
Quelle serait la pente de $3 x - 5y = 15$?
:::

::: remark
Cette notion recevra une généralisation puissante (la dérivée) plus tard.
:::

# Trouver une équation de droite p. A13 {.w-1--2}

::: {.example title="Exemples 3, 4 p. A13"}
Trouvez une équation de droite:

- passant par $(1, -7)$ avec une pente de $-\frac 1 2$.
- passant par $(-1, 2)$ et $(3, -4)$.
:::

# Droites parallèles et perpendiculaires p. A14 {.w-1--2}

::: proposition
Soit deux droites de pentes $m_1$ et $m_2$ respectivement.
Elles sont

- **parallèles** si $m_1 = m_2$
- **perpendiculaires** si $m_1 m_2 = -1$ (ou $m_2 = -1/m_1$)
:::

::: {.example title="Exemple 7 pp. A14-A15"}
Trouvez l'équation d'une droite passant par $(5, 2)$ qui est parallèle à la droite $4x + 6y + 5 = 0$.
:::

::: {.example title="Exemple 8 p. A15"}
Montrez que les droites $2x + 3y = 1$ et $6x - 4y - 1 = 0$ sont perpendiculaires.
:::

# Paraboles {.w-1--2}

::: definition
Lieu des points équidistants entre un point (le **foyer**)
et une droite (la **directrice**).
:::

<Geogebra id="HJAnUrNN" />

# Paraboles (10.5, p. 741) {.w-3--5}

Nous nous concentrons sur le cas où la directrice est parallèle aux axes.

$$
\boxed{x^2 = 4py},
\quad \text{directrice}: y = -p,
\quad \text{foyer}: (0, p)
$$

::: {.flex .items-center}
::::: column
### $p > 0$

~~~ yaml {.plot}
data:
  - fn: x^2 / 4
  - fn: '-1'
  - points:
      - [0, 1]
    fnType: 'points'
    graphType: scatter
~~~
:::::

::::: column
### $p < 0$

~~~ yaml {.plot}
data:
  - fn: -x^2 / 4
  - fn: '1'
  - points:
      - [0, -1]
    fnType: 'points'
    graphType: scatter
~~~
:::::
:::

# Paraboles (p. 742) {.w-3--5}

En échangeant $x$ et $y$, on obtient la famille de paraboles suivantes:

$$
\boxed{y^2 = 4px},
\quad \text{directrice}: x = -p,
\quad \text{foyer}: (p, 0)
$$

::: {.flex .items-center}
::::: column
### $p > 0$

~~~ yaml {.plot}
data:
  - fn: 'y^2 - 4x'
    fnType: implicit
  - fn: 'x + 1'
    fnType: implicit
  - points:
      - [1, 0]
    fnType: 'points'
    graphType: scatter
~~~
:::::

::::: column
### $p < 0$

~~~ yaml {.plot}
data:
  - fn: 'y^2 + 4x'
    fnType: implicit
  - fn: 'x - 1'
    fnType: implicit
  - points:
      - [-1, 0]
    fnType: 'points'
    graphType: scatter
~~~
:::::
:::

# Parabole: exemple p. 742 {.w-1--2}

::: example
Trouvez le foyer et la directrice de la parabole $y^2 + 10x = 0$ et esquissez le graphe
:::

~~~ yaml {.plot}
data:
  - fn: 'y^2 + 10x'
    fnType: implicit
~~~

# Cercle p. A17 {.w-1--2}

::: {.definition title="Équation du cercle"}
$$
(x - h)^2 + (y - k)^2 = r^2
$$
:::

::: {.example title="Exemples 1, 2 p. A17"}
- Trouvez l'équation du cercle de rayon $3$ et de centre $(2, -5)$
- Esquissez le graphe de l'équation $x^2 + y^2 + 2x - 6y + 7 = 0$.
:::

# Ellipse (p. 743)

::::: w-1--2
::: definition
Lieu des points tels que la somme des distance à deux points (appelés **foyers**) est constante.
:::
:::::

<Geogebra id="kPBYDVfZ" width={1200} />

# Ellipse (p. 743) {.w-2--3}

$$
\boxed{
\frac {x^2} {a^2} + \frac {y^2} {b^2} = 1
}
$$

::::: {.flex .gap-4}
::: column
### Cas 1: $a \geq b$

$$
\text{foyer:} \left(\pm \underbrace{\sqrt{a^2 - b^2}}_c, 0\right)
\qquad
\text{sommets:} (\pm a, 0)
$$

~~~ yaml {.plot}
data:
  - fn: 'x^2/9 + y^2/4 - 1'
    fnType: implicit
  - points:
      - [-2.236, 0]
      - [2.236, 0]
    fnType: 'points'
    graphType: scatter
~~~
:::

::: column
### Cas 2: $a < b$

$$
\text{foyer:} \left(0, \pm \underbrace{\sqrt{b^2 - a^2}}_c\right)
\qquad
\text{sommets:} (0, \pm b)
$$

~~~ yaml {.plot}
data:
  - fn: 'x^2/4 + y^2/9 - 1'
    fnType: implicit
  - points:
      - [0, -2.236]
      - [0, 2.236]
    fnType: 'points'
    graphType: scatter
~~~
:::
:::::

# Ellipses: exemples p. 743 {.w-1--2}

::: example
Esquissez le graphe de $9 x^2 + 16y^2 = 144$ et trouvez les foyers.
:::

~~~ yaml {.plot}
data:
  - fn: '9x^2 + 16 y^2 - 144'
    fnType: implicit
~~~

::: example
Trouvez une équation de l'ellipse avec foyers $(0, \pm 2)$ et sommets $(0, \pm 3)$.
:::

# Hyperboles

::::: w-1--2
::: definition
Lieu des points tels que la différence des distance à deux points (appelés **foyers**) est constante.
:::
:::::

<Geogebra id="tqD3PMzy" width={1200} />

# Hyperboles (p. 744) {.w-3--5}

::::: {.flex .gap-4}
::: column
### $\frac {x^2} {a^2} - \frac {y^2} {b^2} = 1$

- Foyers: $\left(\pm \underbrace{\sqrt{a^2 + b^2}}_c, 0\right)$
- Sommets: $(\pm a, 0)$
- Asymptotes: $y = \pm \frac b a x$

~~~ yaml {.plot}
data:
  - fn: 'x^2/9 - y^2/4 - 1'
    fnType: implicit
  - points:
      - [-3.606, 0]
      - [3.606, 0]
    fnType: 'points'
    graphType: scatter
~~~
:::

::: column
### $\frac {y^2} {a^2} - \frac {x^2} {b^2} = 1$

- Foyers: $\left(0, \pm \underbrace{\sqrt{a^2 + b^2}}_c\right)$
- Sommets: $(0, \pm a)$
- Asymptotes: $y = \pm \frac a b x$

~~~ yaml {.plot}
data:
  - fn: 'y^2/4 - x^2/9 - 1'
    fnType: implicit
  - points:
      - [0, -3.606]
      - [0, 3.606]
    fnType: 'points'
    graphType: scatter
~~~
:::
:::::

# Hyperboles: exemple p. 745 {.w-1--2}

::: {.example title="Exemple 4 p. 745"}
Trouvez les foyers et asymptotes de l'hyperbole $9 x^2 - 16 y^2 = 144$
et esquissez le graphe.
:::

~~~ yaml {.plot}
data:
  - fn: '9x^2 - 16y^2 - 144'
    fnType: implicit
~~~

::: {.example title="Exemple 5 p. 745"}
Trouvez les foyers et l'équation de l'hyperbole avec sommets $(0, \pm 1)$ et asymptotes $y = 2x$.
:::

# Coniques translatées p. 745 {.w-1--2}

::: example
Trouvez l'équation de l'ellipse qui a
pour foyer $(2, -2)$, $(4, -2)$ et comme sommets $(1, -2)$ et $(5, -2)$.
:::

::: example
Dessinez la conique $9 x^2 - 4y^2 - 72x + 8y + 176 = 0$.
:::
