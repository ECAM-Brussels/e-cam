---
title: Dérivées
slideshow: true
---

# Pente et croissance {.w-1--2}

Soit $f$ une fonction linéaire.

::: {.definition title="Pente"}
$$
f' = \frac {f(x) - f(a)} {x - a},
\qquad a, x \in \mathbb R, x \neq a.
$$
:::

::: proposition
- $f$ est **croissante** ssi $f' \geq 0$
- $f$ est **décroissante** ssi $f' \leq 0$
- $f$ est **constante** ssi $f' = 0$.
:::

~~~ yaml {.plot}
data:
  - fn: x/2 - 1
~~~

# Pente et opérations de fonctions {.w-1--2}

La pente se comporte remarquablement bien
avec les opérations de fonctions.

::: proposition
Soient $f, g$ des fonctions linéaires.

$$
(f \pm g)' = f' \pm g'\\
(f \circ g)' = f' \cdot g'
$$
:::

::: remark
Ceci est absolument remarquable et justifie pourquoi on mesure l'inclinaison d'une droite
avec la tangente de l'angle.
$$
f' = \tan \theta
$$
:::

# Pente et calcul d'aire {.w-1--2}

::: proposition
Soit $f$ une fonction linéaire.
La fonction originale peut être récupérée (à constante près) par le calcul d'aire algébrique sous la courbe.
:::

~~~ yaml {.plot}
height: 600
width: 800
data:
  - fn: '2'
    range: [0, 3]
    closed: true
  - fn: '2'
~~~

# De pente à dérivée {.w-1--2}

::: question
- Est-il possible de généraliser la pente d'une droite à une courbe,
  de telle sorte à préserver le lien avec la croissance?
- Est-il possible que cette généralisation se comporte bien avec les opérations de fonctions?
- Est-il possible de garder le lien avec l'aire?
:::

La réponse est affirmative, c'est la **dérivée**.

> In order to put his system into mathematical form at all, Newton had to devise the
> concept of **differential quotients** and propound the laws of motion in
> the form of **total differential equations**—perhaps the **greatest advance in thought** that
> a single individual was ever privileged to make.

Albert Einstein

# Idée: limite de sécantes p. 108 {.w-1--2}

::: question
Comment définir la pente en un point d'une courbe?
:::

~~~ yaml {.plot}
height: 375
width: 500
data:
  - fn: 1/8 * (x + 2)^2 - 3
    secants:
      - x0: 1
        x1: 3
      - x0: 1
        updateOnMouseMove: true
  - fnType: points
    graphType: scatter
    points:
      - [1, -1.875]
~~~

::: hint
Approximer par des sécantes
:::

# Définition de dérivée p. 111 {.w-1--2}

~~~ yaml {.plot}
width: 800
height: 600
data:
  - fn: 1/8 * (x + 2)^2 - 3
    secants:
      - x0: 1
        updateOnMouseMove: true
  - fnType: points
    graphType: scatter
    points:
      - [1, -1.875]
~~~

::: {.definition title="Nombre dérivé"}
$$
f'(a)
= \lim_{h \to 0} \frac{f(a + h) - f(a)} h
= \lim_{x \to a} \frac{f(x) - f(a)}{x - a}
$$
:::

# Interprétation: Vitesse instantanée {.w-1--2}

::: example
Calculez la vitesse instantanée à l'instant $t$ lorsque
$$
x(t) = v_0 t + \frac {a t^2} 2
$$
:::

~~~ python {.run}
from sympy import *
v0, t, a, h = symbols("v0 t a h")
x = lambda t: v0 * t + a * t ** 2 / 2
v = limit((x(t + h) - x(t)) / h, h, 0)
~~~

# Exemples {.w-1--2}

$$
f'(a)
= \lim_{h \to 0} \frac{f(a + h) - f(a)} h
= \lim_{x \to a} \frac{f(x) - f(a)}{x - a}
$$

::: {.example title="Exemple 4 p. 111"}
Calculez la dérivée de $f(x) = x^2 - 8x + 9$ en $2$ et en $a$.
:::

~~~ python {.run}
from sympy import *
x, a = symbols("x a")
f = lambda x: x**2 - 8*x + 9
limit((f(x) - f(a)) / (x - a), x, a)
~~~

::: {.example title="Exemple 5 p. 112"}
Calculez la dérivée de $f(x) = \sqrt{x}$ en $a$.
:::

~~~ python {.run}
from sympy import *
x, a = symbols("x a")
limit((sqrt(x) - sqrt(a)) / (x - a), x, a)
~~~

# Tangente p. 113 {.w-1--2}

~~~ yaml {.plot}
width: 600
height: 450
xAxis:
  domain: [-2, 10]
yAxis:
  domain: [-10, 8]
data:
  - fn: x^2 - 8x + 9
    graphType: polyline
  - fn: -2x
~~~

::: definition
La **tangente** à $y = f(x)$ en $(a, f(a))$ est la droite
$$
y = f'(a) (x - a) + f(a)
$$
:::

::: remark
Vous pouvez vous entraîner sur la plateforme [learning.ecam.be](/PM1C/practice/differentiation/tangents)
:::

# Normale p. 113 {.w-1--2}

~~~ yaml {.plot}
width: 600
height: 450
xAxis:
  domain: [-2, 10]
yAxis:
  domain: [-8.5, 0.5]
data:
  - fn: x^2 - 8x + 9
    graphType: polyline
  - fn: -2x
  - fn: 1/2 * (x - 3) - 6
~~~

::: definition
La **normale** à $y = f(x)$ en $(a, f(a))$ est la droite
$$
y = \frac {-1} {f'(a)} (x - a) + f(a)
$$
:::

::: remark
Vous pouvez vous entraîner sur la plateforme [learning.ecam.be](/PM1C/practice/differentiation/tangents)
:::

# Tangente: exemple p. 113 {.w-1--2}

~~~ yaml {.plot}
width: 600
height: 450
xAxis:
  domain: [-2, 10]
yAxis:
  domain: [-8.5, 0.5]
data:
  - fn: x^2 - 8x + 9
    graphType: polyline
  - fn: -2x
  - fn: 1/2 * (x - 3) - 6
~~~

::: example
Trouvez la tangente et la normale de $y = x^2 - 8x + 9$ au point $(3, -6)$
:::

::: text-sm
~~~ python {.run}
from sympy import *
x = Symbol("x")
y = x**2 - 8*x + 9
m = y.diff(x).subs({x: 3})
[Eq(Symbol("y"), m * (x - 3) - 6), Eq(Symbol("y"), -1/m * (x - 3) - 6)]
~~~
:::

# Fonction dérivée p. 120 {.w-1--2}

~~~ yaml {.plot}
width: 800
height: 600
data:
  - fn: x^2 - 3
    derivative:
      fn: 2*x
      updateOnMouseMove: true
~~~

::: {.definition title="Fonction dérivée p. 120"}
$$
f'(x) = \lim_{h \to 0} \frac {f(x + h) - f(x)} h
$$
:::

# Fonction dérivée

~~~ yaml {.plot}
- data:
  - fn: 0.1 (x^2 - 4x) + 2 sin(0.8 x)
    derivative:
      fn: 0.1 (2x - 4) + 2 * 0.8 cos(0.8x)
      updateOnMouseMove: true
  width: 800
  height: 450
- data:
  - fn: 0.1 (2x - 4) + 2 * 0.8 cos(0.8x)
    color: green
  width: 800
  height: 450
~~~

# Exemple: $\sin$ {.w-1--2}

::: example
Calculez $\sin'$
:::

::: text-sm
~~~ python {.run}
from sympy import *
x, h = symbols("x h")
expand_trig((sin(x + h) - sin(x)) / h)
~~~
:::

~~~ yaml {.plot}
- data:
  - fn: sin(x)
    derivative:
      fn: cos(x)
      updateOnMouseMove: true
- data:
  - fn: cos(x)
    color: green
~~~
::::

# Notation p. 123 {.w-1--2}

Pour la fonction $y = f(x)$, nous écrirons
pour la **fonction dérivée**

$$
f'(x), \quad
y', \quad
\frac {\mathrm{d} y} {\mathrm{d} x}, \quad
\frac {\mathrm{d} f} {\mathrm{d} x}, \quad
\frac {\mathrm{d}} {\mathrm{d} x} f(x), \quad
\mathrm{D} f(x), \quad
\mathrm{D}_x f(x), \quad
$$

Pour le nombre dérivé en $a$,
les notations usuelles sont
$$
f'(a), \quad
\left.\frac {\mathrm{d} y} {\mathrm{d} x}\right|_{x = a} \quad
\left.\frac {\mathrm{d} f} {\mathrm{d} x}\right|_{x = a} \quad
\left.\frac {\mathrm{d}} {\mathrm{d} x} f(x)\right|_{x = a} \quad
$$

# Non dérivabilité p. 125

Il se peut que la dérivée n'existe pas en un point.

::::: columns-3
~~~ yaml {.plot}
- data:
  - fn: abs(x)
- data:
  - fn: '-1'
    range: [-1000, 0]
    color: green
  - fn: '1'
    range: [0, 1000]
    color: green
~~~

~~~ yaml {.plot}
- data:
  - fn: sqrt(abs(x))
- data:
  - fn: -1 /( 2*sqrt(abs(x)) )
    range: [-1000, 0]
    color: green
  - fn: 1 /( 2*sqrt(abs(x)) )
    range: [0, 1000]
    color: green
~~~

~~~ yaml {.plot}
- data:
  - fn: nthRoot(x, 3)
- data:
  - fn: 1/(3 * nthRoot(x, 3)^2)
    color: green
~~~
:::::

# Dérivées d'ordre supérieur p. 126 {.w-1--2}

Puisque $f'$ est une fonction,
on peut la dériver à son tour.
On parle alors de **dérivée seconde**.
Elle se note

$$
f''(x), \quad
y'', \quad
\frac {\mathrm{d}^2 y} {\mathrm{d} x^2}, \quad
\frac {\mathrm{d}^2 f} {\mathrm{d} x^2}, \quad
\frac {\mathrm{d}^2} {\mathrm{d} x^2} f(x), \quad
\mathrm{D}^2 f(x), \quad
\mathrm{D}^2_x f(x), \quad
$$

Pour le nombre dérivé en $a$,
les notations usuelles sont
$$
f''(a), \quad
\left.\frac {\mathrm{d}^2 y} {\mathrm{d} x^2}\right|_{x = a} \quad
\left.\frac {\mathrm{d}^2 f} {\mathrm{d} x^2}\right|_{x = a} \quad
\left.\frac {\mathrm{d}^2} {\mathrm{d} x^2} f(x)\right|_{x = a} \quad
$$

::: remark
Nous verrons plus tard que la dérivéé seconde mesure la **concavité**,
l'**accélération**.
:::

On peut généraliser à l'ordre $n$:

$$
y^{(n)} = f^{(n)}(x) = \frac {\dd^n y} {\dd x^n}.
$$

# Règles de calcul (section 2.3) {.w-1--2}

$$
\left(x^p\right)' = p x^{p - 1}
\quad \implies (\sqrt x)' = \dots,
\quad \left(\frac 1 x\right)' = \dots\\
\left(\sin x\right)' = \cos x\\
\left(\cos x\right)' = -\sin x\\
\left(\tan x\right)' = \frac 1 {\cos^2 x}\\
\left(\cot x\right)' = -\frac 1 {\sin^2 x}\\
\left(e^x\right)' = e^x\\
\left(a^x\right)' = (\ln a) a^x\\
\left(\ln x\right)' = \frac 1 x\\
\left(\log_a x\right)' = \frac 1 {x \ln a}\\
\left(\arcsin x\right)' = \frac 1 {\sqrt{1 - x^2}}\\
\left(\arccos x\right)' = \frac {-1} {\sqrt{1 - x^2}}\\
\left(\arctan x\right)' = \frac {1} {1 + x^2}\\
$$

::: question
En degrés, que vaut la dérivée de $\sin$?
:::

# Dérivée et opérations de fonctions (2.3) {.w-1--2}

::: proposition
$$
(cf)'(x) = c f'(x)\\
$$
$$
(f \pm g)'(x) = f'(x) \pm g'(x)\\
$$
$$
(f \cdot g)'(x) = f'(x) g(x) + f(x) g'(x)\\
$$
$$
\left(\frac f g\right)'(x) = \frac{f'(x) g(x) - f(x) g'(x)} {g^2(x)}\\
$$
$$
(f \circ g)'(x) = f'(g(x)) g'(x)
$$
:::

::: remark
Entraînez-vous sur [learning.ecam.be](/PM1C/practice/differentiation/differentiation)
:::

# Exemples {.w-1--2}

Calculez les dérivées suivantes:

- $y = x^2 \sin x$
- $y = \frac {x^2 + x - 2} {x^3 + 6}$
- $y = \sqrt{x^2 + 1}$
- $y = \sin^2 x$
- $y = \sin(x^2)$
- $y = \sin(\cos(\tan x))$
- $y = \left(\frac {t - 2} {2t + 1}\right)^9$
- $y = (2x + 1)^5 (x^3 - x + 1)^4$

::: remark
Entraînez-vous sur [learning.ecam.be](/PM1C/practice/differentiation/differentiation)
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
diff(x**2 * sin(x))
~~~

# Dérivation implicite p. 166 {.w-1--2}

Si on a une expression $y = f(x)$, la dérivée peut se calculer explicitement.
Que faire si on avait $x^2 + y^2 = 1$?

#### Dérivée implicite

1. On dérive les deux membres de l'équation par rapport à $x$
2. On isole $\frac {\dd y} {\dd x}$.

::: {.example title="Exemple 1 p. 166"}
Si $x^2 + y^2 = 25$, trouvez $\frac {\dd y} {\dd x}$.
Ensuite, calculez la tangente au cercle en $(3, 4)$.
:::

~~~ yaml {.plot}
height: 500
data:
  - fn: x^2 + y^2 - 25
    fnType: implicit
  - fn: 3x + 4y - 25
    fnType: implicit
~~~

# Exemple de dérivée implicite p. 167 {.w-1--2}

::: {.example title="Exemple 2 p. 167"}
a. Calculez $y'$ si $x^3 + y^3 = 6xy$.
b. Trouvez la tangente en $(3, 3)$
:::

~~~ yaml {.plot}
height: 600
width: 800
data:
  - fn: x^3 + y^3 - 6 x y
    fnType: implicit
  - fn: 6 - x
~~~

# Approximation et linéarisation p. 192 {.w-1--2}

~~~ yaml {.plot}
height: 550
width: 800
xAxis:
  domain: [-2, 3.5]
yAxis:
  domain: [-0.5, 3.5]
data:
  - fn: sqrt(x + 3)
  - fn: 7/4 + x/4
  - fnType: points
    graphType: scatter
    points:
      - [1, 2]
~~~

$$
\underbrace{f(x)}_{\text{fonction}}
\approx
\underbrace{f(a) + f'(a) (x - a)}_{\text{tangente}}
$$

$$
\underbrace{f(x) - f(a)}_{\Delta y} \approx f'(a) \underbrace{(x - a)}_{\Delta x}
$$

# Différentielle p. 194 {.w-1--2}

$$
\underbrace{f(x) - f(a)}_{\Delta y} \approx f'(a) \underbrace{(x - a)}_{\Delta x}
$$

::: definition
$$
\mathrm{d} y = f'(x) \mathrm{d} x
$$
:::

::: {.example title="Exemple 3 p. 195"}
Comparez les valeurs de $\Delta y$ et $\dd y$ si $y = x^3 + x^2 - 2x + 1$ et $x$ change de $2$ à $2.01$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
y = x**3 + x**2 - 2*x + 1
Delta_y = y.subs({x: 2.01}) - y.subs({x: 2})
dy = y.diff(x).subs({x: 2}) * 0.01
[dy, Delta_y]
~~~

# Application: Calcul d'erreur p. 196 {.w-1--2}

::: {.example title="Exemple 4 p. 196"}
Le rayon d'une sphère a été mesuré comme étant $21 \pm 0.05$ cm.
Quelle sera l'erreur lors du calcul du volume?
:::

~~~ python {.run}
from sympy import *
r = Symbol("r")
dr = 0.05
V = 4 / 3 * pi * r**3
dV = N(V.diff(r).subs({r: 21}) * dr)
[dV, N(dV / V.subs({r: 21}))]
~~~

::: remark
On s'intéresse normalement à l'**erreur** relative $\frac {\dd V} {V}$
:::