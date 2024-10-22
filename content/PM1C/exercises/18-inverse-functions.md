---
title: Fonctions réciproques
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="6.1.32"}
Sachant que $f(x) = 2 - x^4$ pour $x \geq 0$,
trouvez une formule explicite pour la réciproque $f^{-1}$ et utilisez-la pour esquisser $f$, $f^{-1}$ et $y = x$.
:::

::: {.exercise title="6.2.8"}
Esquisse la fonction $h(x) = 2 \left(\frac 1 2\right)^x - 3$ à l'aide des transformations graphiques.
:::

::: {.exercise title="6.2.15"}
Trouvez le domaine de la fonction
$$
f(x) = \frac {1 - e^{x^2}} {1 - e^{1-x^2}}
$$
:::

::: {.exercise title="6.2.42"}
Dérivez $f(t) = \tan(1 + e^{2t})$
:::

::: {.exercise title="6.3.23"}
Résoudre $\ln (4x + 2) = 3$.
Donnez une solution exacte,
et une solution arrondie à 3 décimales.
:::

# 6.1.22 p. 418 {.w-1--2}

::: exercise
En théorie de la relativité,
la masse d'une particule de vitesse $v$ est
$$
m = f(v) = \frac {m_0} {\sqrt{1 - \frac {v^2} {c^2}}},
$$
où $m_0$ est la masse au repos
et $c$ est la vitesse de la lumière dans le vide.
Trouvez la fonction réciproque
et expliquez sa signification.
:::

~~~ python {.run}
from sympy import *
v, m, m0, c = symbols("v m m0 c", positive=True)
eq = Eq(m, m0 / sqrt(1 - v**2/c**2))
Eq(v, solve(eq, v)[0])
~~~

# 6.2.52 p. 430 {.w-1--2}

::: exercise
Trouvez une équaton de la tangente à $y = \frac {1 + x} {1 + e^x}$ au point $(0, \frac 1 2)$
:::

~~~ python {.run}
from sympy import *
x, y = symbols("x y")
f = (1 + x) / (1 + exp(x))
y = f.diff(x).subs({x: 0}) * x + f.subs({x: 0})
~~~

# 6.3.25 p. 439 {.w-1--2}

::: exercise
Résolvez l'équation $\ln x + \ln(x - 1) = 0$.
Donnez la solution exacte, et arrondie à 3 chiffres après la virgule.
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
solve(ln(x) + ln(x - 1))[0]
~~~

# 6.3.43 p. 439 {.w-1--2}

::: exercise
Trouvez le domaine de la fonction $f(x) = \ln(4 - x^2)$.
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
solveset(4 - x**2 > 0, x, S.Reals)
~~~

# 6.3.57 p. 440 {.w-1--2}

::: exercise
Montrez que la fonction $f(x) = \ln(x + \sqrt{x^2 + 1})$ est une fonction impaire,
et trouvez sa réciproque.
:::

~~~ yaml {.plot}
data:
  - fn: log(x + sqrt(x^2 + 1))
    graphType: polyline
~~~

~~~ python {.run}
from sympy import *
x, y, t = symbols("x y t")
eq = Eq(y, ln(x + sqrt(x**2 + 1)))
inverse = solve(eq, x)[0].rewrite(exp)
Eq(y, inverse.subs({x: y, y: x}))
~~~

# Exercice 6.4.29 {.w-1--2}

::: exercise
Montrez que
$$
\frac {\dd} {\dd x} \ln (x + \sqrt{x^2 + 1}) = \frac 1 {\sqrt{x^2 + 1}}
$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
f = ln(x + sqrt(x**2 + 1))
simplify(f.diff(x))
~~~