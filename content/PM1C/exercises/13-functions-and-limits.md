---
title: Fonctions et limites
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="1.3.3"}
![](/images/exercises/1.3.3.png){.w-96 .mx-auto .block}
:::

::: {.exercise title="1.3.15"}
Tracez le graphe de $y = \sin 4x$ en utilisant les transformations graphiques.
:::

::: {.exercise title="1.5: 1, 2"}
1. Expliquez ce que l'équation
   $$\lim_{x \to 2} f(x) = 5$$
   veut dire.
   Est-il possible que celle-ci soit vrai,
   mais que $f(2) = 3$?
2. Expliquez ce que les équations
   $$
   \lim_{x \to 1^-} f(x) = 3,\quad
   \lim_{x \to 1^+} f(x) = 7
   $$
   veulent dire.
   Dans cette situation, est-il possible que $\lim_{x \to 1} f(x)$ existe?
:::

# Préparation {.columns-2}

::: {.exercise title="1.5.10"}
![](/images/exercises/1.5.10.png)
:::

::: {.exercise title="1.5.36"}
$$
\lim_{x \to 3^-} \frac {x^2 + 4x} {x^2 - 2x - 3}
$$
:::

::: {.exercise title="1.6.10"}
Qu'il y a-t-il d'incorrect dans l'équation suivante?
$$
\frac {x^2 + x - 6} {x - 2} = x + 3
$$
Dès lors, expliquez pourquoi l'équation
$$
\lim_{x \to 2} \frac {x^2 + x - 6} {x - 2} = \lim_{x \to 2} (x + 3)
$$
est tout de même correcte.
:::

# Exercice 1.3: 14, 19, 23 {.w-1--2}

::: exercise
Tracez les graphes en partant des fonctions de référence
et en appliquant les transformations graphiques:

- $y = -\sqrt{x} - 1$
- $y = x^2 - 2x + 5$
- $y = 3 \sin \frac x 2 + 1$
:::

# Exercice 1.3.61 {.w-1--2}

::: exercise
Un bateau se déplace à une vitesse de $30$ km/h
parallèlement au littoral.
Le bateau est à $6$ km du rivage
et passe un phare à midi.

a. Exprime la distance $s$ entre le phare et le bateau
   comme une fonction de $d$, la distance que le bateau
   a parcouru depuis midi.
   En d'autres termes, trouvez $f$ de sorte que $s = f(d)$.
b. Exprimez $d$ comme fonction de $t$,
   le temps écoulé depuis midi, c'est-à-dire trouvez $g$ tel que $d = g(t)$.
c. Trouvez $f \circ g$.
   Qu'est-ce que cette fonction représente?
:::

# Exercice 1.5.11 {.w-1--2}

::: exercise
Esquissez le graphe de la fonction
et déterminez les valeurs de $a$ pour lesquelles
$\lim_{x \to a} f(x)$ existe.

$$
f(x) = \begin{cases}
\cos x & \text{si } x \leq 0\\
1 - x & \text{si } 0 < x < 1\\
\frac 1 x & \text{si } x \geq 1
\end{cases}
$$
:::

# Exercice 1.5.45 {.w-1--2}

::: exercise
En théorie de la relativité,
la masse d'une particule allant à vitesse $v$ est
$$
m = \frac {m_0} {\sqrt{1 - \frac {v^2} {c^2}}},
$$
où $m_0$ est la masse au repos et $c$ est la vitesse de la lumière.
Que se passe-t-il lorsque $v \to c^{-}$?
:::

# Exercice 1.6.19 {.w-1--2}

::: exercise
Évaluez la limite si elle existe
$$
\lim_{t \to 3} \frac {t^3 - 27} {t^2 - 9}
$$
:::

~~~ python {.run}
from sympy import *
t = Symbol("t")
limit((t**3 - 27) / (t**2 - 9), t, 3)
~~~
