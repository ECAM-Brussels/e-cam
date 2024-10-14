---
title: Application des dérivées
slideshow: true
---

# Extrema globaux p. 210 {.w-1--2}

~~~ yaml {.plot}
yAxis:
  domain: [0, 5.5]
xAxis:
  domain: [-0, 9]
data:
  - fn: -0.05 x^2 sin(3.141592653 / 2 * x) + 2
    range: [1, 8]
~~~

::: {.definition title="Extrema globaux"}
- $f(c)$ est un **maximum global** de $f$ si $f(c) \geq f(x)$ pour tout $x \in \mathrm{dom} f$
- $f(c)$ est un **minimum global** de $f$ si $f(c) \leq f(x)$ pour tout $x \in \mathrm{dom} f$
- $f(c)$ est un **extremum global** si c'est un minimum ou un maximum global.
:::

# Extrema locaux p. 210 {.w-1--2}

~~~ yaml {.plot}
yAxis:
  domain: [0, 5.5]
xAxis:
  domain: [-0, 9]
data:
  - fn: -0.05 x^2 sin(3.141592653 / 2 * x) + 2
    range: [1, 8]
~~~

::: {.definition title="Extrema locaux"}
- $f(c)$ est un **maximum local** de $f$ si $f(c) \geq f(x)$ pour tout $x$ proche de $c$
- $f(c)$ est un **minimum local** de $f$ si $f(c) \leq f(x)$ pour tout $x$ proche de $c$
- $f(c)$ est un **extremum local** si c'est un minimum ou un maximum local
:::

# Théorème de Fermat {.w-1--2}

~~~ yaml {.plot}
data:
  - fn: -0.25(x-1)^2 + 2
~~~

::: {.proposition title="Théorème de Fermat"}
Si $f$ a un extremum local en $c$, et si $f$ est dérivable en $c$,
alors $f'(c) = 0$.
:::

::: definition
Un point critique est un point où $f$ n'est pas dérivable ou $f'(c) = 0$.
:::

::: {.proposition title="Théorème de Fermat"}
Les extrema locaux sont des points critiques
:::

# Points critiques: exemple p. 214 {.w-1--2}

::: example
Trouvez les points critiques de

a. $f(x) = x^3 - 3x^2 + 1$
b. $f(x) = x^{\frac 3 5} (4 - x)$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
f = x**3 - 3*x**2 + 1
solveset(f.diff(x))
~~~

# Exemples et contre-exemples {.columns-3}

::: break-inside-avoid
~~~ yaml {.plot}
data:
  - fn: x^2
~~~
:::

::: break-inside-avoid
~~~ yaml {.plot}
data:
  - fn: x^3
~~~
:::

::: break-inside-avoid
~~~ yaml {.plot}
data:
  - fn: abs(x)
~~~
:::

# Trouvez les extrema globaux {.w-1--2}

Les points suivants sont candidats pour les extrema globaux

- Points critiques
- Points au bords

::: example
Trouvez les extrema globaux de $f(x) = x^3 - 3x^2 + 1$ sur $[-\frac 1 2, 4]$.
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
f = x**3 - 3*x**2 + 1
critical = solveset(f.diff(x))
candidates = [Rational(-1, 2), 4] + list(critical)
[(t, f.subs({x: t})) for t in candidates]
~~~

# Théorème de Rolle {.w-1--2}

::: {.proposition title="Théorème de Rolle"}
Soit $f$ dérivable sur $[a, b]$ telle que $f(a) = f(b)$.
Il existe $c \in ]a, b[$ tel que $f'(c) = 0$.
:::

# Théorème des accroissements finis {.w-1--2}

~~~ yaml {.plot}
grid: false
xAxis:
  domain: [0, 3]
yAxis:
  domain: [-0.2, 1.6]
data:
  - fn: 1/4 * (x^3 - x)
    range: [0, 2]
  - fn: 3 / 4 x
  - fn: 1/4 * ( 3 (x - 2/sqrt(3)) + 2*sqrt(3)/9)
annotations:
  - x: -2
    text: a
  - x: 3
    text: b
~~~

::: {.proposition title="Théorème des accroissements finis"}
Soit $f$ dérivable sur $[a, b]$.
Il existe $c \in ]a, b[$ tel que
$$
\frac {f(b) - f(a)} {b - a} = f'(c)
$$
:::

# Croissance {.w-1--2}

::: proposition
Soit $f$ une fonction dérivable sur $[a, b]$.

- si $f' = 0$ sur $[a, b]$, alors $f$ est constante.
- si $f' \geq 0$ sur $[a, b]$, alors $f$ est croissante.
- si $f' \leq 0$ sur $[a, b]$, alors $f$ est décroissante.
:::

# Exemple {.w-1--2}

::: {.example title="Exemple 3.3.1 p. 227"}
Étudiez la croissance de $f(x) = 3x^4 - 4x^3 - 12x^2 + 5$.
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
f = 3*x**4 - 4*x**3 - 12*x**2 + 5
solveset(f.diff(x))
~~~

~~~ yaml {.plot}
data:
  - fn: 3x^4 - 4x^3 - 12x^2 + 5
    graphType: polyline
~~~

# Concavité {.w-1--2}

![](/images/convexity.png)

::: definition
- convexe: tangentes au-dessus du graphe
- concave: tangentes en-dessous du graphe
- point d'inflexion: point où s'opère un changement de concavité
:::

::: proposition
Soit $I$ un intervalle.

- si $f''(x) > 0$ sur $I$, $f$ est **convexe** sur $I$
- si $f''(x) < 0$ sur $I$, $f$ est **concave** sur $I$
:::

# Critère de la dérivée seconde {.w-1--2}

::: proposition
Soit $f$ deux fois dérivable et
supposons que $f''$ est continue en $c$.

- Si $f'(c) = 0$ et $f''(c) > 0$, $c$ est un **maximum local** de $f$.
- Si $f'(c) = 0$ et $f''(c) < 0$, $c$ est un **minimum local** de $f$.
:::

::: remark
On ne peut rien déduire quand $f''(c) = 0$.

- $y = x^4$: min local
- $y = -x^4$: max local
- $y = x^3$: point d'inflexion
:::

# Étude de concavité p. 232 {.w-1--2}

::: {.example title="Example 6 p. 232"}
Étudiez la concavité de $x^4 - 4x^3$.
Trouvez les points d'inflexion et les extrema locaux.
:::

~~~ yaml {.plot}
data:
  - fn: x^4 - 4x^3
    graphType: polyline
~~~

# Étude de fonctions {.w-1--2}

::: example
Esquisse le graphe de la fonction $f(x) = x^{2/3} (6 - x)^{1/3}$.
:::

~~~ yaml {.plot}
data:
  - fn: nthRoot(x, 3)^2 * nthRoot(6 - x, 3)
    graphType: polyline
~~~

# Asymptotes obliques p. 255 {.w-1--2}

~~~ yaml {.plot}
data:
  - fn: x^3 / (x^2 + 1)
  - fn: x
~~~

::: {.definition title="Asymptote oblique"}
La droite $y = mx + b$ est une **asymptote oblique** à $y = f(x)$ si
$$
\lim_{x \to +\infty} (f(x) - (mx + b)) = 0
\quad \text{ou} \quad
\lim_{x \to -\infty} (f(x) - (mx + b)) = 0
$$
:::

# Esquisses de fonction p. 251 {.w-1--2}

- Domaine
- Intersections avec les axes
- Symétrie
- Asymptotes (horizontales, verticales, ou obliques)
- Croissance
- Extrema locaux
- Concavité et points d'inflexion

::: example
Esquissez le graphe de $f(x) = \frac {x^3} {x^2 + 1}$.
:::

# Optimisation p. 265 {.w-1--2}

::: example
Une fermière a $1200$ m de palissade et souhaite délimiter un champ rectangulaire
le long d'une rivière.
Elle n'a pas besoin de séparation le long de la rivière.
Quelles sont les dimensions du champ d'aire maximale?
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
y = 1200 - 2*x
A = x * y
solveset(A.diff(x))
~~~

# Optimisation p. 266 {.w-1--2}

::: example
Un cylindre est fabriqué pour contenir 1L d'essence (ou $1000$ $\text{cm}^3$).
Trouvez les dimensions qui minimiseront le coût du métal nécésaire à la fabrication du conteneur.
:::

~~~ python {.run}
from sympy import *
r = Symbol("r")
h = 1000 / (pi * r**2)
A = 2 * pi * r**2 + 2 * pi * r * h
r = solveset(A.diff(r), r, S.Reals)
~~~

# Variante sur la loi de Snell-Descartes p. 268 {.w-1--2}

::: example
Une femme lance son bateau d'un point $A$ sur la rive d'une rivière droite,
large de $3$ $\text{km}$ et souhaite arriver au point B, sur l'autre rive
et $8$ km plus loin le long de la rivière.
Sachant qu'elle rame à $6$ km/h et court à $8$ km/h, comment attendrait-elle ce point
le plus rapidement possible?
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
T = sqrt(x**2 + 9) / 6 + (8 - x) / 8
solveset(T.diff(x))
~~~

::: question
Quel est le lien avec la loi de Snell-Descartes?
:::

# Optimisation p. 269 {.w-1--2}

::: example
Trouvez le rectangle le plus large qui peut être inscrit dans un demi-cercle de rayon $r$.
:::