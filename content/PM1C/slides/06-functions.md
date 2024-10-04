---
title: Fonctions
slideshow: true
---

# Domaine et image {.w-1--2}

::: definition
$$
\mathrm{dom} f = \{ x \in \R : f(x) \ \text{a un sens}\}\\
\mathrm{im} f = \{ f(x) : x \in \mathrm{dom} f\}
$$
:::

::: {.shadow .border .rounded .px-4 .w-4--5 .mx-auto}
#### Conditions d'existence

- $\sqrt \square \implies \square \geq 0$
- $\frac {\star} {\square} \implies \square \neq 0$
- $\log_a(\square) \implies \square > 0$
:::

::: {.example title="Exemple 6 p. 13"}
Trouvez le domaine de
$$
f(x) = \sqrt{x + 2}
\quad
g(x) = \frac 1 {x^2 - x}
$$
:::

# Vocabulaire de base pour décrire une fonction

Croissante
: $x \leq y \implies f(x) \leq f(y)$

Décroissante
: $x \leq y \implies f(x) \geq f(y)$

Paire
: $f(x) = f(-x)$

Impaire
: $f(-x) = -f(x)$

# Fonctions de base: polynômes {.flex .justify-between}

::: function
~~~ yaml {.plot}
data:
  - fn: x
~~~

- $f(x) = x$
- domaine: $\mathbb R$
- image: $\mathbb R$
- impaire
- racine: $0$
:::

::: function
~~~ yaml {.plot}
data:
  - fn: x^2
~~~

- $f(x) = x^2$
- domaine: $\mathbb R$
- image: $\mathbb R^+$
- paire
- racine: $0$
:::

::: function
~~~ yaml {.plot}
data:
  - fn: x^3
~~~

- $f(x) = x^3$
- domaine: $\mathbb R$
- image: $\mathbb R$
- impaire
- racine: $0$
:::

# Fonctions de base: trigonométrie {.flex .justify-between}

::: function
~~~ yaml {.plot}
data:
  - fn: sin(x)
~~~

- $f(x) = \sin(x)$
- domaine: $\mathbb R$
- image: $[-1, 1]$
- impaire
- période: $2 \pi$
- racines: $k \pi$, $k \in \Z$
:::

::: function
~~~ yaml {.plot}
data:
  - fn: cos(x)
~~~

- $f(x) = \cos(x)$
- domaine: $\mathbb R$
- image: $[-1, 1]$
- paire
- période: $2 \pi$
- racines: $\frac \pi 2 + k \pi$, $k \in \Z$
:::

::: function
~~~ yaml {.plot}
data:
  - fn: tan(x)
~~~

- $f(x) = \tan x$
- domaine: $\mathbb R \setminus \left\{ \frac \pi 2 + k \pi : k \in \mathbb Z \right\}$
- image: $\mathbb R$
- impaire
- période: $\pi$
- racines: $k \pi$, $k \in \Z$
:::

# Fonctions de base: exponentielles et logarithmes {.flex .justify-around}

::: function
~~~ yaml {.plot}
data:
  - fn: exp(x)
~~~

- $f(x) = e^x$
- domaine: $\mathbb R$
- image: $\mathbb R^+_0$
- $AH \equiv y = 0$
:::

::: function
~~~ yaml {.plot}
data:
  - fn: ln(x)
~~~

- $f(x) = \ln x$
- domaine: $\mathbb R^+_0$
- image: $\mathbb R$
- racine: $1$
- $AV \equiv x = 0$
:::

# Fonctions de base: autres {.flex .justify-around}

::: function
~~~ yaml {.plot}
data:
  - fn: abs(x)
~~~

- $f(x) = |x|$
- domaine: $\mathbb R$
- image: $\mathbb R^+$
- paire
:::

::: function
~~~ yaml {.plot}
data:
  - fn: sqrt(x)
~~~

- $f(x) = \sqrt x$
- domaine: $\mathbb R^+$
- image: $\mathbb R^+$
:::

::: function
~~~ yaml {.plot}
data:
  - fn: 1/x
~~~

- $f(x) = \frac 1 x$
- domaine: $\mathbb R_0$
- image: $\mathbb R_0$
- $AV \equiv x = 0$
- $AH \equiv y = 0$
:::

# Transformations graphiques

<Geogebra id="yuSZksXg" />

$$y = a f(bx + c) + d$$

- Compression horizontale de facteur $b$
- Translation horizontale de $-c/b$
- Étirement vertical de facteur $a$
- Translation verticale de $d$

# Opérations de fonctions {.w-1--2}

Les opérations de fonctions permettent de créer plus de fonctions.

::: definition
$$
(f \pm g)(x) = f(x) \pm g(x)\\
(f \cdot g)(x) = f(x) \cdot g(x)\\
\left(\frac f g\right)(x) = \frac {f(x)} {g(x)}\\
(f \circ g)(x) = f(g(x))
$$
:::

# Composition de fonctions {.w-1--2}

$$
(f \circ g)(x) = f(g(x))
$$

::: {.example title="Exemple 7 p. 41"}
Si $f(x) = \sqrt x$ et $g(x) = \sqrt{x - 2}$,
trouvez les fonctions suivantes et leurs domaines:
$$
f \circ g \qquad g \circ f \qquad f \circ f \quad g \circ g
$$
:::

::: {.example title="Exemple 9 p. 42"}
Écrire $F(x) = \cos^2(x + 9)$ comme une composée de 3 fonctions usuelles.
:::

# Limites: introduction {.w-1--2}

$$
f(x) = \frac {\sin x} x,
\quad x \neq 0
$$

~~~ python {.run}
from sympy import *
f = lambda x: sin(x) / x
for i in range(7):
    print(f"f({10**(-i)}) = {f(10**(-i)).evalf(20)}")
~~~

$$\lim_{x \to 1} f(x) = 1$$

# Limites et continuité {.w-1--2}

La limite permet de donner à l'évaluation hors du domaine.

::: {.definition title="Limite en un réel"}
$$
\lim_{x \to a} f(x) = L
$$
si $f(x)$ est aussi proche que l'on veut de $L$ en imposant seulement
que $x$ soit suffisament proche mais différent de $a$.
:::

Elle coïncide avec l'évaluation classique pour de nombreuses fonctions.

::: {.definition title="Continuité"}
Une fonction $f$ est continue en $a \in \mathrm{dom} f$ si
$$
\lim_{x \to a} f(x) = f(a)
$$
:::

# Limites: propriétés p. 63 {.w-1--2}

::: proposition
$$
\lim_{x \to a} \left( f(x) \pm g(x)\right) = \lim_{x \to a} f(x) \pm \lim_{x \to a} g(x)\\
\lim_{x \to a} cf(x) = c \lim_{x \to a} f(x)\\
\lim_{x \to a} \left( f(x) \cdot g(x)\right) = \lim_{x \to a} f(x) \cdot \lim_{x \to a} g(x)\\
\lim_{x \to a} \frac {f(x)} {g(x)} = \frac {\lim_{x \to a} f(x)} {\lim_{x \to a} g(x)}
$$
à condition que les membres de droites aient un sens.
:::

::: proposition
Si $f$ est continue, alors
$$
\lim_{x \to a} f(g(x)) = f\left(\lim_{x \to a} g(x)\right)
$$
:::

# Limite d'une fonction rationnelle {.w-1--2}

::: {.example title="Exemple 5 p. 67"}
$$
\lim_{h \to 0} \frac {(3 + h)^2 - 9} h
$$
:::

::: hint
Pour une fonction rationnelle, il est utile de factoriser et simplifier
:::

~~~ python {.run}
from sympy import *
h = Symbol("h")
limit(((3 + h)**2 - 9) / h, h, 0)
~~~

# Limite: exemple avec une racine {.w-1--2}

::: {.example title="Exemple 6 p. 67"}
$$
\lim_{t \to 0} \frac {\sqrt{t^2 + 9} - 3} {t^2}
$$
:::

::: hint
Quand une racine est en jeu, il est utile d'employer le binôme conjugué
:::

~~~ python {.run}
from sympy import *
t = Symbol("t")
limit((sqrt(t**2 + 9) - 3) / t**2, t, 0)
~~~

# Limites latérales {.w-1--2}

$$
\lim_{x \to a^-} f(x) \qquad \text{limite à gauche}\\
\lim_{x \to a^+} f(x) \qquad \text{limite à droite}
$$

::: proposition
$$
\lim_{x \to a} f(x) = L
\Longleftrightarrow
\lim_{x \to a^-} f(x) = \lim_{x \to a^+} f(x) = L
$$
:::

::: {.example title="Exemples 8, 9 p. 68"}
Déterminez si les limites suivantes existent:
$$
\lim_{x \to 0} \frac {|x|} x\\
\lim_{x \to 4} f(x),
\quad f(x) = \begin{cases}
\sqrt{x - 4} &\text{si}\ x > 4\\
8 - 2x &\text{si}\ x < 4\\
\end{cases}
$$
:::

# Le théorème du sandwich {.w-1--2}

::: proposition
$$
\begin{cases}
f(x) \leq g(x) \leq h(x)\\
\lim_{x \to a} f(x) = \lim_{x \to a} h(x)
\end{cases}
\implies
\lim_{x \to a} f(x) =
\lim_{x \to a} g(x) = \lim_{x \to a} h(x)
$$
:::

~~~ yaml {.plot}
xAxis:
  domain: [-0.3, 0.3]
data:
  - fn: x^2
  - fn: x^2 sin(1/x)
  - fn: -x^2
~~~

::: example
$$\lim_{x \to 0} x^2 \sin \frac 1 x = 0$$
:::

::: text-sm
~~~ python {.run}
from sympy import *
x = Symbol("x")
limit(x**2 * sin(1/x), x, 0)
~~~
:::