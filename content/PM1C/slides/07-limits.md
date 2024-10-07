---
title: Limites et asymptotes
slideshow: true
---

# Une limite importante p. 151 {.w-1--2}

::: proposition
$$
\lim_{\theta \to 0} \frac {\sin \theta} {\theta} = 1
$$
:::

<Geogebra id="vhsrfnng" height={500} />

::: question
Reconnaissez-vous cette limite?
:::

# Deuxième limite p. 152 {.w-1--2}

::: proposition
$$
\lim_{\theta \to 0} \frac {\cos \theta - 1} {\theta} = 1
$$
:::

::: question
Reconnaissez-vous cette limite?
:::

# Exemples basés sur ces limites p. 153 {.w-1--2}

::: example
Calculez les limites suivantes

$$
\lim_{x \to 0} \frac {\sin 7x} {4 x}\\
\lim_{x \to 0} x \cot x\\
\lim_{\theta \to 0} \frac {\cos \theta - 1} {\sin \theta}
$$
:::

~~~ python {.run}
from sympy import *
x = Symbol("x")
limit(sin(7*x) / (4*x), x, 0)
~~~

# Limites infinies en un réel p. 57 {.w-1--2}

~~~ yaml {.plot}
height: 600
width: 800
data:
  - fn: 1/x^2
~~~

On a envie d'écrire
$$
\lim_{x \to 0} f(x) = +\infty
$$

# Limites infinies en un réel: déinition p. 57 {.w-1--2}

::: definition
Nous écrirons
$$
\lim_{x \to a} f(x) = +\infty
$$
si $f(x)$ peut être aussi grand que l'on veut
en imposant seulement que $x$ soit suffisament proche mais différent de $a$.
:::

On peut écrire une définition similaire pour
$$
\lim_{x \to a} f(x) = -\infty
\qquad
\lim_{x \to a^+} f(x) = +\infty
\qquad
\lim_{x \to a^-} f(x) = +\infty
$$
etc.

# Asymptotes verticales p. 58 {.w-1--2}

::: definition
La droite verticale $x = a$ est appelée **asymptote verticale** de $y = f(x)$
si l'une des affirmations suivantes est correcte:

$$
\lim_{x \to a} f(x) = +\infty,
\quad
\lim_{x \to a^-} f(x) = +\infty,
\quad
\lim_{x \to a^+} f(x) = +\infty\\
\quad
\lim_{x \to a} f(x) = -\infty,
\quad
\lim_{x \to a^-} f(x) = -\infty,
\quad
\lim_{x \to a^+} f(x) = -\infty,
$$
:::

# Exemple 7 p. 59 {.w-1--2}

::: example
La courbe $y = \frac {2x} {x - 3}$ a-t-elle une asymptote verticale?
:::

~~~ yaml {.plot}
height: 600
width: 800
data:
  - fn: 2x / (x - 3)
annotations:
  - x: 3
    text: x = 3
~~~

# Exemple 8 p. 59 {.w-1--2}

::: example
Trouvez les asymptotes verticales de $f(x) = \tan x$.
:::

~~~ yaml {.plot}
height: 600
width: 800
data:
  - fn: tan(x)
~~~

# Limites à l'infini et asymptotes (3.4) {.w-1--2}

Voici le graphe de
$$
f(x) = \frac {x^2 - 1} {x^2 + 1}
$$

~~~ yaml {.plot}
height: 600
width: 800
data:
  - fn: (x^2 - 1) / (x^2 + 1)
  - fn: '1'
annotations:
  - y: 1
    text: y = 1
~~~

Cela nous donnerait envie d'écrire

$$
\lim_{x \to +\infty} \frac {x^2 - 1} {x^2 + 1} = 1
\qquad \qquad
\lim_{x \to -\infty} \frac {x^2 - 1} {x^2 + 1} = 1
$$

# Définitions des limites à l'infini p. 238 {.w-1--2}

::: definition
Nous écrirons
$$
\lim_{x \to +\infty} f(x) = L
$$
si $f(x)$ peut être aussi proche que l'on souhaite de $L$ en imposant seulement
que $x$ soit suffisament large.
:::

::: definition
Nous écrirons
$$
\lim_{x \to -\infty} f(x) = L
$$
si $f(x)$ peut être aussi proche que l'on souhaite de $L$ en imposant seulement
que $x$ soit suffisament petit.
:::

# Illustrations {.columns-2}

~~~ yaml {.plot}
height: 600
width: 800
data:
  - fn: 5 * 1 / ((x + 5)^2 + 1) sin(3 * (x + 5)) + 1
  - fn: '1'
annotations:
  - y: 1
    text: y = 1
~~~

~~~ yaml {.plot}
height: 600
width: 800
data:
  - fn: -1 + exp(x)
  - fn: '-1'
annotations:
  - y: -1
    text: y = -1
~~~

# Asymptotes horizontales p. 239 {.w-1--2}

::: definition
La droite $y = L$ est une **asymptote horizontale** de $y = f(x)$ si
$$
\lim_{x \to +\infty} f(x) = L
\quad \text{ou} \quad
\lim_{x \to -\infty} f(x) = L
$$
:::

~~~ yaml {.plot}
height: 600
width: 800
data:
  - fn: 5 * 1 / ((x + 5)^2 + 1) sin(3 * (x + 5)) + 1
  - fn: '1'
annotations:
  - y: 1
    text: y = 1
~~~

# Exemple p. 239 {.w-1--2}

::: example
Trouvez les limites infinies, les limites à l'infini et les asymptotes de la fonction $f$ dont
le graphe est donné ci-dessous.
:::

![](/images/example-3.4.1.png){.block .mx-auto}

# Évaluation de limites a l'infini p. 241 {.w-1--2}

::: example
$$
\lim_{+\infty} \frac {3x^2 - x - 2} {5 x^2 + 4x + 1}
$$
:::

~~~ yaml {.plot}
height: 600
width: 800
data:
  - fn: (3x^2 - x - 2) / (5x^2 + 4x + 1)
  - fn: '3/5'
annotations:
  - y: 0.6
    text: y = 3/5
~~~

# Évaluation de limites a l'infini p. 242 {.w-1--2}

::: example
Trouvez les asymptotes horizontales de
$$
f(x) = \frac {\sqrt{2x^2 + 1}} {3x - 5}
$$
:::

~~~ yaml {.plot}
height: 600
width: 800
data:
  - fn: sqrt(2 x^2 + 1) / (3x - 5)
  - fn: sqrt(2) / 3
  - fn: -sqrt(2) / 3
~~~

# Calcul de limites p. 242 {.w-1--2}

::: example
Calculez les limites suvantes si elles existent:

- $\lim_{x \to +\infty} \left(\sqrt{x^2 + 1} - x\right)$
- $\lim_{x \to +\infty} \sin \frac 1 x$
- $\lim_{x \to +\infty} \sin x$
:::

# Limites infinies aux infinis p. 243 {.w-1--2}

::: example
Calculez les limites suivantes:

- $\lim_{x \to \pm \infty} x^3$
- $\lim_{x \to \pm \infty} (x^2 - x)$
- $\lim_{x \to \pm \infty} \frac {x^2 + x} {3 - x}$
:::

# Esquisses de graphe p. 244 {.w-1--2}

::: example
Esquissez le graphe de
$$
y = (x - 2)^4 (x + 1)^3 (x - 1)
$$
en trouvant les interceptions avec les graphes et les limites aux infinis.
:::

~~~ yaml {.plot}
width: 800
height: 600
data:
  - fn: (x-2)^4 (x + 1)^3 (x - 1)
~~~