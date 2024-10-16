---
title: Fonctions réciproques III
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="Exercice 6.7.19 p. 501"}
$$
\sinh 2x = 2 \sinh x \cosh x
$$
:::

::: {.exercise title="Exercice 6.7.53"}
Calculez la dérivée de $f(x) = x \sinh^{-1}(x / 3) - \sqrt{9 + x^2}$ et simplifiez
:::

::: {.exercise title="Exercices 6.8: 15, 30, 33, 35"}
Calculez les limites suivantes:

$$
\lim_{t \to 0} \frac {e^{2t} - 1} {\sin t}\\
\lim_{x \to 0} \frac {x - \sin x} {x - \tan x}\\
\lim_{x \to 0} \frac {x 3^x} {3^x - 1}\\
\lim_{x \to 0} \frac {\ln (1 + x)} {\cos x + e^x - 1}
$$
:::

# 6.7.30 {.w-1--2}

::: exercise
Prouvez que
$$
\cosh^{-1}(x) = \ln (x + \sqrt {x^2 - 1})
$$
:::

~~~ python {.run}
from sympy import *
x, y = symbols("x y")
eq = Eq(y, cosh(x))
solve(eq, x)[1].subs({y: x})
~~~

# 6.7.59 p. 502 {.columns-2}

::: exercise
![](/images/exercises/6.7.59.png)
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
y = 20 * cosh(x / 20) - 15
N(y.diff(x).subs({x: 7}))
~~~

~~~ python {.run}
from sympy import *
x = Symbol("x")
y = 20 * cosh(x / 20) - 15
m = y.diff(x).subs({x: 7})
N(pi / 2 - atan(m))
~~~

# 6.8.47 p. 512 {.w-1--2}

::: exercise
Calculez la limite

$$
\lim_{x \to +\infty} x^3 e^{-x^2}
$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
f = x**3 * exp(-x**2)
limit(f, x, oo)
~~~

# 6.8.56 p. 512 {.w-1--2}

::: exercise
Calculez la limite

$$
\lim_{x \to +\infty} (x - \ln x)
$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
f = x - ln(x)
limit(f, x, oo)
~~~

# 6.8.59 p. 512 {.w-1--2}

::: exercise
Calculez la limite

$$
\lim_{x \to 0} (1 - 2x)^{\frac 1 x}
$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
f = (1 - 2*x) ** (1/x)
limit(f, x, 0)
~~~

# 6.8.62 p. 512 {.w-1--2}

::: exercise
Calculez la limite

$$
\lim_{x \to +\infty} (e^x + 10x)^{\frac 1 x}
$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
f = (exp(x) + 10*x) ** (1 / x)
limit(f, x, oo)
~~~