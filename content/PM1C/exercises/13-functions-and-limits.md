---
title: Fonctions et limites
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="Exercices 1.2: 11, 12"}
Déterminez l'expression des fonctions quadratiques dont le graphe est montré ci-dessous.
![](/images/exercises/1.2.11.png)
:::

::: {.exercise title="Exercices 1.3: 15, 19"}
Tracez les graphes en partant des fonctions de référence
et en appliquant les transformations graphiques:

- $y = \sin 4x$
- $y = x^2 - 2x + 5$
:::

::: {.exercise title="1.3.3"}
![](/images/exercises/1.3.3.png){.w-100 .mx-auto .block}
:::



# Préparation p2 {.columns-2}

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

::: {.exercise title="1.5.36"}
$$
\lim_{x \to 3^-} \frac {x^2 + 4x} {x^2 - 2x - 3}
$$
:::

::: {.exercise title="1.5.10"}
![](/images/exercises/1.5.10.png)
:::


# Exercice 1.2.13 {.w-1--2}

::: exercise
Déterminez une fonction cubique $f$ si $f(1) = 6$,
et $f(-1) = f(0) = f(2) = 0$.
:::

~~~ python {.run}
from sympy import *
a, x = symbols("a x")
P = a * (x + 1) * x * (x - 2)
P = P.subs({a: solve(Eq(P.subs(x, 1), 6))[0]})
~~~

# Exercice 1.2.18 {.w-1--2}

![](/images/exercises/1.2.18.png){.h-4--5}

# Exercice 1.3: 14, 23 {.w-1--2}

::: exercise
Tracez les graphes en partant des fonctions de référence
et en appliquant les transformations graphiques:

- $y = -\sqrt{x} - 1$
- $y = 3 \sin \frac x 2 + 1$
:::

# Exercice 1.3.28 {.w-1--2}

::: exercise
Une étoile variable est une étoile dont la luminosité augmente et diminue alternativement. Pour l’étoile variable la plus visible, Delta Cephei, le temps entre deux maxima de luminosité est de 5.4 jours, la luminosité moyenne (ou magnitude) de l’étoile est de 4.0 et sa luminosité varie de ±0.35 magnitudes. Déterminez une fonction qui modélise la luminosité de Delta Cephei en fonction du temps.
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

# Réponses

<Iframe class="w-full h-full" src="/documents/pm1c-answers.pdf#page=12" />
