---
title: Systèmes
slideshow: true
---

# Préparation

::: {.columns-2 .h-full}
<Iframe class="w-full h-full" src="/documents/simultaneous-equations.pdf" />

::::: exercise
Préparation: 1a, 2a, 2b, 2c

Séance: 2d, 2e, 2g, 2h
:::::
:::

# Exercice 2d {.w-1--2}

::: exercise
$$
\begin{cases}
5x + 5y + 5z = -20\\
4x + 3y + 3z = -6\\
-4x + 3y + 3z = 9
\end{cases}
$$
:::

~~~ python {.run}
from sympy import *
x, y, z = symbols("x y z")
system = [
    5*x + 5*y + 5*z + 20,
    4*x + 3*y + 3*z + 6,
    -4*x + 3*y + 3*z - 9
]
solve(system)
~~~

# Exercice 2e {.w-1--2}

::: exercise
$$
\begin{cases}
2x - y + z = 4\\
x + y + z = -1\\
x - y + z = 3
\end{cases}
$$
:::

~~~ python {.run}
from sympy import *
x, y, z = symbols("x y z")
system = [
    2*x - y + z - 4,
    x + y + z + 1,
    x - y + z - 3,
]
solve(system)
~~~

# Exercice 2g {.w-1--2}

::: exercise
$$
\begin{cases}
-x + 4y + 3z = 1\\
7y + 7z = 2\\
2x - y + z = 0
\end{cases}
$$
:::

~~~ python {.run}
from sympy import *
x, y, z = symbols("x y z")
system = [
    -x + 4*y + 3*z -1,
    7*y + 7*z - 2,
    2*x - y + z,
]
solve(system)
~~~

# Exercice 2h {.w-1--2}

::: exercise
$$
\begin{cases}
3x + y - z = -2\\
-x + y + z = 4\\
2x - 2y - 2z = -8
\end{cases}
$$
:::

~~~ python {.run}
from sympy import *
x, y, z = symbols("x y z")
system = [
    3*x + y - z + 2,
    -x + y + z - 4,
    2*x - 2*y - 2*z + 8,
]
solve(system)
~~~