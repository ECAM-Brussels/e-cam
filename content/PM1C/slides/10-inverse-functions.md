---
title: Fonctions réciproques
slideshow: true
---

# Fonctions réciproques p. 412 {.w-1--2}

Toutes les fonctions n'ont pas de réciproque.
Celles qui en ont une sont appelées **injectives**.

::: definition
Une fonction $f$ est **injective** si
$$
x_1 \neq x_2 \quad \implies f(x_1) \neq f(x_2)
$$
:::

# Test de la droite horizontale p. 412 {.w-1--2}

::: remark
Une fonction est **injective** si les droites horizontales
ne coupent le graphe qu'une seule fois.
:::

<Geogebra id="gMn8Y4k3" />

# Exemples p. 413 {.w-1--2}

::: example
- La fonction $x^3$ est-elle injective?
- La fonction $x^2$ est-elle injective?
:::

# Fonction réciproque p. 414 {.w-1--2}

::: definition
Soit $f$ une fonction injective.
Sa réciproque $f^{-1}$ est une fonction définie sur $\mathrm{im} f$ via
$$
f^{-1}(f(x)) = x
$$
:::

$$
\mathrm{dom} f^{-1} = \mathrm{im} f \qquad
\mathrm{im} f^{-1} = \mathrm{dom} f
$$

::: warning
Dans l'écriture $f^{-1}$, $-1$ n'est pas un exposant.
$$
f^{-1}(x) \neq \frac 1 {f(x)}
$$
:::

# Fonction réciproque et symétrie {.w-1--2}

La fonction réciproque "échange" $x$ et $y$,
ce qui fait que les graphes de $f$ et $f^{-1}$ seront symétriques
par rapport à l'axe $y = x$.

~~~ yaml {.plot}
data:
  - fn: x^3 + 2
  - fn: x
  - fn: nthRoot(x - 2, 3)
~~~

~~~ yaml {.plot}
data:
  - fn: sqrt(-1 -x)
  - fn: x
  - fn: -x^2 - 1
    range: [0, 2000]
~~~

# Calcul de fonction réciproque p. 415 {.w-1--2}

### Trouvez la fonction réciproque?

- Écrivez $y = f(x)$
- Exprimez $x$ en fonction de $y$
- Échangez $y$ et $x$.

::: example
Trouvez la fonction réciproque de

- $f(x) = x^3 + 2$.
- $g(x) = \sqrt{1 - x}$.
:::

~~~ yaml {.plot}
data:
  - fn: x^3 + 2
  - fn: x
  - fn: nthRoot(x - 2, 3)
~~~

# Dérivées de fonction réciproque p. 416 {.w-1--2}

::: proposition
$$
(f^{-1})'(a) = \frac 1 {f'(f^{-1}(a))}
$$
:::

::: remark
Dans la notation de Leibniz, cela devient
$$
\frac {\dd y} {\dd x} = \frac 1 {\frac {\dd x} {\dd y}},
\qquad y = f^{-1}(x)
$$
:::

::: example
Si $f(x) = 2 x + \cos x$, trouvez $(f^{-1}) ' ( 1 )$.
:::

::: text-sm
~~~ python {.run}
from sympy import *
x = Symbol("x")
f = 2*x + cos(x)
1 / f.diff(x).subs({x: 0})
~~~
:::

# Exponentielles p. 420 {.w-1--2}

$$
b^n = \underbrace{b \cdot b \cdot \dots \cdot b}_{n\ \text{fois}}
\qquad b > 0
$$

::: proposition
- $b^{x + y} = b^x b^y$
- $b^{x - y} = \frac {b^x} {b^y}$
- $(b^x)^y = b^{x y}$
- $(a b)^x = a^x b^x$
:::

On étend l'exponentielle sur les rationnels via
$$
b^{0} = 1,
\quad
b^{-n} = \frac 1 {b^n},\quad
b^{\frac p q} = \sqrt[q]{b^p}
$$
de sorte que les propriétés ci-dessus restent vraies.

Ensuite, on étend $b^x$ sur les réels par prolongement continu.

# Exponentielles p. 421

<Geogebra id="tktcvcqd" />

# Exponentielles {.columns-2}

::: break-inside-avoid
~~~ yaml {.plot}
yAxis:
  domain: [-1, 7]
data:
  - fn: exp(ln(2)*x)
~~~

- $y = b^x$, $b > 1$
- passe par $(0, 1)$, $(1, b)$
- $\text{AH} \equiv y = 0$
- croissante
:::

::: break-inside-avoid
~~~ yaml {.plot}
yAxis:
  domain: [-1, 7]
data:
  - fn: exp(ln(1/2)*x)
~~~

- $y = b^x$, $0 < b < 1$
- passe par $(0, 1)$, $(1, b)$
- $\text{AH} \equiv y = 0$
- décroissante
:::

# Dérivée des fonctions exponentielles p. 426 {.w-1--2}

::: proposition
Soit $0 < b$.

$$
\frac {\dd} {\dd x} b^x =
b^x
\left(\lim_{h \to 0} \frac {b^h - 1} h \right)
$$
:::

::: definition
On définit $e$ comme l'unique $b > 0$ tel que
$$
\lim_{h \to 0} \frac {b^h - 1} h
= 1.
$$

En particulier, $\frac {\dd} {\dd x} e^x = e^x$.
:::

~~~ python {.run}
from sympy import *
N(exp(1), 30)
~~~

# Exemples p. 426 {.w-1--2}

::: proposition
Calculez les dérivées suivantes

- $y = e^{\tan x}$
- $y = e^{-4 x} \sin 5x$
:::

# Fonction logarithme {.w-1--2}

::: definition
Soit $b > 0$ avec $b \neq 1$.
Le **logarithme en base $b$** est la fonction réciproque de $x \mapsto b^x$,
c'est-à-dire
$$
\log_b b^x = x
$$
:::

~~~ yaml {.plot}
data:
  - fn: exp(x)
  - fn: x
  - fn: ln(x)
~~~

# Logarithme: animation

<Geogebra id="P5Rm88qB" />

# Logarithmes: graphes {.columns-2}

::: break-inside-avoid
~~~ yaml {.plot}
xAxis:
  domain: [-1, 11]
data:
  - fn: ln(x) / ln(2)
~~~

- $y = \log_b x$, $b > 1$
- domaine: $\R^-_0$
- passe par $(1, 0)$, $(b, 1)$
- $\text{AV} \equiv x = 0$
- croissante
:::

::: break-inside-avoid
~~~ yaml {.plot}
xAxis:
  domain: [-1, 11]
data:
  - fn: ln(x) / ln(1/2)
~~~

- $y = \log_b x$, $0 < b < 1$
- domaine: $\R^-_0$
- passe par $(1, 0)$, $(b, 1)$
- $\text{AV} \equiv x = 0$
- décroissante
:::

# Logarithmes: exemples {.w-1--2}

::: example
Calculez:

- $\log_3 81$
- $\log_{25} 5$
- $\log_{10} 0.001$
:::

~~~ python {.run}
from sympy import *
log(81, 3)
~~~

# Propriétés des logarithmes {.w-1--2}

Par définition:

$$
\log_b b^x = x\\
b^{\log_b x} = x, \quad x > 0
$$

::: proposition
- $\log_b (xy) = \log_b x + \log_b y$
- $\log_b \frac x y = \log_b x - \log_b y$
- $\log_b x^p = p \log_b x$
:::

::: proposition
$$
\log_a x = \frac {\log_b x} {\log b a}
$$
:::

# Logarithme naturel {.w-1--2}

~~~ yaml {.plot}
data:
  - fn: ln(x)
~~~

::: remark
- $\ln = \log_e$: logarithme naturel, base $e$
- $\log = \log_{10}$
:::

# Exemples p. 436 {.w-1--2}

::: example
Résolvez l'équation $e^{5 - 3x} = 10$
:::

::: text-sm
~~~ python {.run}
from sympy import *
x = Symbol("x")
solveset(exp(5 - 3*x) - 10, x, S.Reals)
~~~
:::

::: example
Développez
$$
\ln \frac {x^2 \sqrt {x^2 + 2}} {3x + 1}
$$
:::

::: text-sm
~~~ python {.run}
from sympy import *
x = Symbol("x")
f = ln(x**2 * sqrt(x**2 + 2) / (3*x + 1))
expand_log(f, force=True)
~~~
:::

# Dérivée des logarithmes {.w-1--2}

$$
(f^{-1})'(x) = \frac 1 {f'(f^{-1}(x))}
$$

::: proposition
$$
\frac {\dd} {\dd x} \ln x = \frac 1 x
$$
:::

# Dérivée de $a^x$ et $\log_a x$ {.w-1--2}

De la formule de changement de base, on obtient alors

::: proposition
$$
\frac {\dd} {\dd x} \log_a x = \frac 1 {x \ln a}
$$
$$
\frac {\dd} {\dd x} a^x = (\ln a) a^x
$$
:::

# Différentiation logarithmique p. 446 {.w-1--2}

1. Appliquer $\ln$ des deux côtés.
2. Dériver implicitement
3. Remplacer $y$ par sa valeur

::: example
Dérivez logarithmiquement $y = \frac{x^{3/4} \sqrt{x^2 + 1}} {(3x + 2)^5}$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
y = Function("y")(x)
f = x**Rational(3, 4) * sqrt(x**2 + 1) / (3*x + 2) ** 5
# On applique ln des deux côtés
eq = [expand_log(ln(s), force=True) for s in [y, f]]
# On dérive
eq = [s.diff(x) for s in eq]
# On isole y'
res = solve(Eq(*eq), y.diff(x))[0]
# On remplace y
res.subs({y: f})
~~~

# Différentiation logarithmique p. 447 {.w-1--2}

1. Appliquer $\ln$ des deux côtés.
2. Dériver implicitement
3. Remplacer $y$ par sa valeur

::: example
Dérivez logarithmiquement $y = x^{\sqrt{x}}$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
y = Function("y")(x)
f = x ** sqrt(x)
# On applique ln des deux côtés
eq = [expand_log(ln(s), force=True) for s in [y, f]]
# On dérive
eq = [s.diff(x) for s in eq]
# On isole y'
res = solve(Eq(*eq), y.diff(x))[0]
# On remplace y
res.subs({y: f})
~~~

# Fonctions cyclométriques p. 486

Les fonctions $\sin$, $\cos$, et $\tan$ sont **périodiques** donc pas **injectives**.
On peut cependant les **restreindre**.

:::::::: {.columns-3 .w-full}

::: break-inside-avoid
~~~ yaml {.plot}
data:
  - fn: sin(x)
    graphType: scatter
    nSamples: 100
  - fn: sin(x)
    color: red
    range: [-1.5707963267948966, 1.5707963267948966]
~~~

- $y = \sin x$
- injective sur $[-\pi/2, \pi/2]$
:::

::: break-inside-avoid
~~~ yaml {.plot}
data:
  - fn: cos(x)
    graphType: scatter
    nSamples: 100
  - fn: cos(x)
    color: red
    range: [0, 3.141592653589793]
~~~

- $y = \cos x$
- injective sur $[0, \pi]$
:::

::: break-inside-avoid
~~~ yaml {.plot}
data:
  - fn: tan(x)
    graphType: scatter
    nSamples: 100
  - fn: tan(x)
    color: red
    range: [-1.5707963267948966, 1.5707963267948966]
~~~

- $y = \tan x$
- injective sur $[-\pi/2, \pi/2]$
:::

::::::::

# Fonctions cyclométriques p. 486 {.columns-3}

::: break-inside-avoid
~~~ yaml {.plot}
xAxis:
  domain: [-2.5, 2.5]
data:
  - fn: sin(x)
    color: lightgray
    range: [-1.5707963267948966, 1.5707963267948966]
  - fn: x
    color: lightgray
    graphType: scatter
    nSamples: 100
  - fn: asin(x)
    color: red
~~~

### $\arcsin x$

- réciproque de $\left.\sin\right|_{[-\pi/2, \pi/2]}$
- domaine: $[-1, 1]$
- image: $[-\pi/2, \pi/2]$
- $\arcsin' x = \frac 1 {\sqrt{1 - x^2}}, \quad -1 < x < 1$
:::

::: break-inside-avoid
~~~ yaml {.plot}
xAxis:
  domain: [-3, 3]
yAxis:
  domain: [-0.5, 3.5]
data:
  - fn: cos(x)
    color: lightgray
    range: [0, 3.141592653589793]
  - fn: x
    color: lightgray
    graphType: scatter
    nSamples: 100
  - fn: acos(x)
    color: red
~~~

### $\arccos x$

- réciproque de $\left.\cos\right|_{[0, \pi]}$
- domaine: $[-1, 1]$
- image: $[0, \pi]$
- $\arccos' x = -\frac 1 {\sqrt{1 - x^2}}, \quad -1 < x < 1$
:::

::: break-inside-avoid
~~~ yaml {.plot}
xAxis:
  domain: [-5, 5]
data:
  - fn: tan(x)
    color: lightgray
    range: [-1.5707963267948966, 1.5707963267948966]
  - fn: x
    color: lightgray
    graphType: scatter
    nSamples: 100
  - fn: atan(x)
    color: red
~~~

### $\arctan x$

- réciproque de $\left.\tan\right|_{[-\pi/2, \pi/2]}$
- domaine: $\mathbb R$
- image: $[-\pi/2, \pi/2]$
- $\arctan' x = \frac 1 {1 + x^2}$
:::

# Dérivées de fonctions cyclométriques {.w-1--2}

::: proposition
- $\arcsin' x = \frac 1 {\sqrt{1 - x^2}}, \quad -1 < x < 1$
- $\arccos' x = -\frac 1 {\sqrt{1 - x^2}}, \quad -1 < x < 1$
- $\arctan' x = \frac 1 {1 + x^2}$
:::

# Exemples {.w-1--2}

::: {.example title="Exemple p. 487"}
Evaluate $\tan(\arcsin \frac 1 3)$
:::

~~~ python {.run}
from sympy import *
trigsimp(asin(Rational(1, 3)))
~~~

::: {.example title="Exemple p. 489"}
Simplifiez l'expression $\cos(\arctan x)$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
trigsimp(cos(atan(x)))
~~~

# Exemples p. 491 {.w-1--2}

::: example
Dérivez

a. $y = \frac 1 {\sin^{-1} x}$

b. $y = x \arctan \sqrt x$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
diff(1 / asin(x), x)
~~~

~~~ python {.run}
from sympy import *
x = Symbol("x")
diff(x * atan(sqrt(x)), x)
~~~