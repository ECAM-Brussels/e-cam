---
title: Algèbre
slideshow: true
---

# Review of Algebra

<Iframe src="https://www.stewartcalculus.com/data/ESSENTIAL%20CALCULUS%20Early%20Transcendentals/upfiles/ess-reviewofalgebra.pdf" class="w-full h-full" />

# Identités remarquables {.columns-2}

![](/images/binomial_formula.png){.h-4--5}

![](/images/binomial_formula_2.png){.h-4--5}

# Identités remarquables {.w-1--2}

::: proposition
$$
(a \pm b)^2 = a^2 \pm 2ab + b^2\\
a^2 - b^2 = (a - b)(a + b)\\
(a \pm b)^3 = a^3 \pm 3a^2b + 3ab^2 \pm b^3\\
a^3 - b^3 = (a - b) (a^2 + ab + b^2)
$$
:::

::: exercise
[Produits remarquables](/skills/algebra/binomial-formulas)
:::

# Factorisation: introduction {.w-1--2}

Dans les équations plus complexes, $x$ apparaît plus qu'une fois et ne peut pas être isolé.

La factorisation permet de couper une équation difficile en plusieurs équations plus simples.

::: example
Résoudre $x^3 - 5x^2 + 9x + 2 = 3x + 2$
:::

::: proposition
Si un polynôme $P(x)$ s'annule en $\alpha$, alors
$$P(x) = (x - \alpha) Q(x)$$
:::

# Factorisation {.w-1--2}

::: example
Factorisez les expressions suivantes:

- $x^2 + 5x - 24$
- $2x^2 - 7x - 4$
- $x^3 - 3x^2 - 10x + 24$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
factor(x**2 + 5*x - 24)
~~~

~~~ {.tsx .raw}
<Graph query={{ "page": { title: { contains: "factorisation"} } }} class="border rounded-xl w-full h-72" />
~~~

# Simplification {.w-1--2}

::: example
Simplifiez $$\frac {x^2 - 16} {x^2 - 2x - 8}.$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
simplify((x**2 - 16) / (x**2 - 2*x - 8))
~~~

# Complétion du carré {.w-1--2}

::: exercise
Réecrivez les expressions en complétant le carré.

- $x^2 + x + 1$
- $2x^2 - 12x + 11$
:::

~~~ python {.run}
from sympy import *
x, alpha, beta, gamma = symbols("x alpha beta gamma")
expr = alpha * (x + beta)**2 + gamma
subs = solve(Eq(x**2 + x + 1, expr), [alpha, beta, gamma])
expr.subs(subs)
~~~

~~~ {.tsx .raw}
<Graph query={{ "page": { title: { contains: "complétion"} } }} class="border rounded-xl w-full h-72" />
~~~

# Le discriminant {.w-1--2}

$$
ax^2 + bx + c = 0
\qquad \Delta = b^2 - 4ac
$$

- Si $\Delta > 0$, les solutions sont
  $$
    x = \frac {-b \pm \sqrt \Delta} {2a}
  $$
- Si $\Delta = 0$ alors
  $$
    x = \frac {-b} {2 a}
  $$
- Si $\Delta < 0$, pas de solutions réelles.

::: warning
Si vous employez $\Delta$ pour factoriser,
n'oubliez pas le $a$:
$$
ax^2 + bx + c = a (x - x_1) (x - x_2)
$$
:::

# Inéquations {.w-1--2}

::: warning
- Appliquer une fonction décroissante inverse l'égalité
- Les inéquations non triviales se résolvent par un tableau de signe.
:::

::: example
Résoudre les inéquations suivantes:

- $x^2 - 5x + 6 \leq 0$
- $x^3 + 3x^2 > 4x$
:::

# (In)Équations avec valeurs absolues {.w-1--2}

::: definition
$$
|x| =
\begin{cases}
x & \text{si} \ x \geq 0\\
-x & \text{si} \ x < 0\\
\end{cases}
$$
:::

::: example
Résoudre les (in)équations suivantes:

- $|2x - 5| = 3$
- $|x - 5| < 2$
:::

# Systèmes d'équations {.w-1--2}

::: example
$$
\begin{cases}
x - 3y - 6z = -16\\
2x + 3y + 5z = 0\\
-4x + 3y + 4z = 20
\end{cases}
$$
:::

~~~ python
from sympy import *
x, y, z = symbols("x y z")
system = [Eq(x - 3*y - 6*z, -16), Eq(2*x + 3*y + 5*z, 0), Eq(-4*x + 3*y + 4*z, 20)]
solve(system)
~~~

~~~ {.tsx .raw}
<Graph query={{ "page": { title: { contains: "système"} } }} class="border rounded-xl w-full h-72" />
~~~

# Infinité de solutions et systèmes impossibles {.w-1--2}

::: question
Que se passe-t-il quand on a un système tel que

$$
\left(\hspace{-5pt}\begin{array}{ccc|c}
  1 & 0 & 0 & 1 \\
  0 & 1 & 0 & 1 \\
  0 & 0 & 0 & 1
\end{array}\hspace{-5pt}\right)
\quad \text{ou} \quad
\left(\hspace{-5pt}\begin{array}{ccc|c}
  1 & 0 & 1 & 1 \\
  0 & 1 & 0 & 1 \\
  0 & 0 & 0 & 0
\end{array}\hspace{-5pt}\right)
$$
:::

# Systèmes: interprétation {.w-1--2}

![](/images/systems.jpg){.w-full}
