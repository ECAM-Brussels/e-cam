---
title: Fonctions réciproques II
slideshow: true
---

# D'Euler à la trigonométrie hyperbolique {.w-1--2}

De la formule $e^{i x} = \cos x + i \sin x$,
on démontre aisément que

$$
\cos x = \frac {e^{i x} + e^{-i x}} 2 \qquad
\sin x = \frac {e^{i x} - e^{-i x}} {2 i}
$$

::: {.definition title="Sinus et cosinus hyperboliques"}
$$
\cosh x = \frac {e^x + e^{-x}} 2 \qquad
\sinh x = \frac {e^{x} - e^{-x}} {2}
$$
:::

::: remark
$$
\cosh x = \cos(i x) \qquad
\sinh x = -i \sin(i x)
$$
:::

# Trigonométrie hyperbolique

<Geogebra id="uv8zutze" />

# $\cosh$, $\sinh$, $\tanh$ {.columns-3}

::: break-inside-avoid
~~~ yaml {.plot}
yAxis:
  domain: [-3.5, 3.5]
data:
  - fn: sinh(x)
~~~

### $y = \sinh x$

- $y = \frac {e^x - e^{-x}} 2$
- domaine: $\R$
- image: $\R$
- parité: impaire
- $\sinh' = \cosh$
:::

::: break-inside-avoid
~~~ yaml {.plot}
yAxis:
  domain: [-1, 6.5]
data:
  - fn: cosh(x)
~~~

### $y = \cosh x$

- $y = \frac {e^x + e^{-x}} 2$
- domaine: $\R$
- image: $[1, +\infty[$
- parité: paire
- $\cosh' = \sinh$
:::

::: break-inside-avoid
~~~ yaml {.plot}
yAxis:
  domain: [-3.5, 3.5]
data:
  - fn: tanh(x)
~~~

### $y = \tanh x$

- $y = \frac {\sinh x}{ \cosh x}$
- domaine: $\R$
- image: $]-1, 1[$
- parité: impaire
- $\tanh' x = \frac 1 {\cosh^2 x}$
:::

# Identités hyperboliques p. 497 {.w-1--2}

::: proposition
- $\sinh(-x) = -\sinh x$
- $\cosh(-x) = \cosh x$
- $\cosh^2 x - \sinh^2 x = 1$
- $1 - \tanh^2 x = \frac 1 {\cosh^2 x}$
- $\sinh(x + y) = \sinh x \cosh y + \cosh x \sinh y$
- $\cosh (x + y) = \cosh x \cosh y + \sinh x \sinh y$
:::

::: proposition
- $\sinh' x = \cosh x$
- $\cosh' x = \sinh x$
- $\tanh' x = \frac 1 {\cosh^2 x}$
:::

# Exemple p. 498 {.w-1--2}

::: example
Dérivez $y = \cosh(\sqrt x)$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
diff(cosh(sqrt(x)), x)
~~~

# Fonctions hyperboliques inverses {.columns-3}

::: break-inside-avoid
~~~ yaml {.plot}
data:
  - fn: sinh(x)
    color: lightgray
  - fn: x
    color: lightgray
  - fn: ln(x + sqrt(x^2 + 1))
    color: red
~~~

- $\sinh^{-1}(x) = \ln (x + \sqrt{x^2 + 1})$
- domaine: $\R$
- image: $\R$
- $\frac {\dd} {\dd x} \sinh^{-1} x = \frac 1 {\sqrt{1 + x^2}}$
:::

::: break-inside-avoid
~~~ yaml {.plot}
xAxis:
  domain: [-1, 11]
yAxis:
  domain: [-2, 5.5]
data:
  - fn: cosh(x)
    color: lightgray
    range: [0, 2000]
  - fn: x
    color: lightgray
  - fn: ln(x + sqrt(x^2 - 1))
    color: red
~~~

- $\cosh^{-1}(x) = \ln (x + \sqrt{x^2 - 1})$
- domaine: $[1, +\infty[$
- image: $\R^+$
- $\frac {\dd} {\dd x} \cosh^{-1} x = \frac 1 {\sqrt{x^2 - 1}}$
:::

::: break-inside-avoid
~~~ yaml {.plot}
data:
  - fn: tanh(x)
    color: lightgray
  - fn: x
    color: lightgray
  - fn: 1/2 * ln((1 + x) / (1 - x))
    color: red
~~~

- $\tanh^{-1}(x) = \frac 1 2 \ln \left(\frac {1 + x} {1 - x}\right)$
- domaine: $]-1, 1[$
- image: $\R$
- $\frac {\dd} {\dd x} \tanh^{-1} x = \frac 1 {1 - x^2}$
:::

# Dérivées des inverses des fonctions hyperboliques {.w-1--2}

::: proposition
- $\frac {\dd} {\dd x} \sinh^{-1} x = \frac 1 {\sqrt{1 + x^2}}$
- $\frac {\dd} {\dd x} \cosh^{-1} x = \frac 1 {\sqrt{x^2 - 1}}$
- $\frac {\dd} {\dd x} \tanh^{-1} x = \frac 1 {1 - x^2}$
:::

# Exemples p. 500 {.w-1--2}

::: example
Calculez $\frac {\dd} {\dd x} \tanh^{-1}(\sin x)$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
simplify(diff(atanh(sin(x)), x))
~~~

# Règle de l'Hôpital: introduction {.w-1--2}

::: question
Que vaut la limite $\displaystyle \lim_{x \to 1} \frac {\ln x} {x - 1}$?
:::

::: hint
Intuitivement, on peut remplacer chaque fonction par son approximation linéaire.
:::

# Règle de l'Hôpital: énoncé p. 504 {.w-1--2}

::: proposition
Soient $f, g$ deux fonctions dérivables et $g'(x) \neq 0$ pour $x \in I \setminus \{a\}$, où $I$ est un intervalle contenant $a$.

Dans les cas d'indétermination $0/0$ et $\infty/\infty$, on a
$$
\lim_{x \to a} \frac {f(x)} {g(x)}
=
\lim_{x \to a} \frac {f'(x)} {g'(x)}
$$
à conditino que la limite à droite existe.
:::

::: remark
L'Hôpital est également valable pour les limites latérales, et les limites à l'infini.
:::

Note à moi-même: prouver $0/0$ dans le cas où $f'$ et $g'$ sont continues en $a$.

# Exemples p. 505 {.w-1--2}

::: example
$$
\lim_{x \to +\infty} \frac {e^x} {x^2}
$$
:::

::: text-sm
Je l'ai mis parce que c'était dans le livre,
mais il faut vraiment rien comprendre pour faire ceci avec l'Hôpital.
:::

::: example
$$
\lim_{x \to 0} \frac {\tan x - x} {x^3}
$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
limit((tan(x) - x) / x**3, x, 0)
~~~

# Formes indéterminées $0 \cdot \infty$ p. 507 {.w-1--2}

Parfois, il faut remettre sous forme d'un quotient
avant d'appliquer l'Hôpital.

::: example
$$
\lim_{x \to 0^+} x \ln x
$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
limit(x * ln(x), x, 0)
~~~

# Différences indéterminées $\infty - \infty$ p. 508 {.w-1--2}

::: example
$$
\lim_{x \to \pi/2^-} \left(\frac 1 {\cos x} - \tan x\right)
$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
limit(1 / cos(x) - tan(x), x, pi / 2, "-")
~~~

# Puissances indéterminées $0^0, \infty^0, 1^\infty$ pp. 509-510 {.w-1--2}

::: example
$$
\lim_{x \to 0^+} (1 + \sin 4x)^{\cot x}
$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
limit((1 + sin(4*x)) ** cot(x), x, 0, "+")
~~~

::: example
$$
\lim_{x \to 0^+} x^x
$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
limit(x ** x, x, 0, "+")
~~~