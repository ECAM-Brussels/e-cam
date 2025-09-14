---
title: Trigonométrie I
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="Exercice D.60"}
Si $\sin x = \frac 1 3$ et $\sec y = \frac 5 4$, $0 \leq x, y \leq \pi/2$,
évaluez $\cos(x + y)$.
:::

::: {.exercise title="Exercice D.69"}
Résolvez l'équation $\sin 2x = \cos x$ sur $[0, 2\pi]$.
:::

::: {.exercise title="Exercice D.71"}
Résolvez l'équation $\sin x = \tan x$ sur $[0, 2\pi]$.
:::

::: {.exercise title="Exercice D.75"}
Résolvez l'inéquation $-1 < \tan x < 1$.
:::

# Identités trigonométriques (pp. A28-A29) {.columns-2}

::: {.proposition title="Sécante, cosécante, cotangente"}
$$
\csc x = \frac 1 {\sin x}
\qquad \sec x = \frac 1 {\cos x}
\qquad \cot x = \frac 1 {\tan x}
$$
:::

::: {.proposition title="Relations fondamentales"}
$$
\sin^2 x + \cos^2 x = 1\\
1 + \cot^2 x = \frac 1 {\sin^2 x}\\
\tan^2 x + 1 = \frac 1 {\cos^2 x}
$$
:::

::: {.proposition title="Formules d'addition"}
$$
\sin (x \pm y) = \sin x \cos y \pm \cos x \sin y\\
\cos(x \pm y) = \cos x \cos y \mp \sin x \sin y\\
\tan(x + y) = \frac {\tan x \pm \tan y} {1 \mp \tan x \tan y}
$$
:::

::: {.proposition title="Formules de duplication"}
$$
\sin 2x = 2 \sin x \cos x\\
\cos 2x = \cos^2 x - \sin^2 x\\
\tan 2x = \frac {2 \tan x} {1 - \tan^2 x}
$$
:::

::: {.proposition title="Formules de Carnot"}
$$
\cos^2 x = \frac {1 + \cos 2x} 2\\
\sin^2 x = \frac {1 - \cos 2x} 2\\
$$
:::

::: {.proposition title="Formules de Simpson"}
$$
\cos x + \cos y = 2 \cos \frac {x + y} 2 \cos \frac {x - y} 2\\
\cos x - \cos y = -2 \sin \frac {x + y} 2 \sin \frac {x - y} 2\\
\sin x + \sin y = 2 \sin \frac {x + y} 2 \cos \frac {x - y} 2\\
\sin x - \sin y = 2 \cos \frac {x + y} 2 \sin \frac {x - y} 2\\
$$
:::

# Exercice 62 p. A35 {.w-1--2}

::: exercise
Si $\sin x = \frac 1 3$ et $\sec y = \frac 5 4$,
et si $0 \leq x, y \leq \frac \pi 2$, évaluez l'expression
$$\sin (x - y)$$
:::

::: hint
Réécrivez $\sec y$ en termes de fonctions plus familières
et trouvez la formule trigonométrique qui lie toutes les quantités de l'énoncé.

Quels nombres trigonométriques devrait-on avoir idéalement pour appliquer cette formule?
Calculez-les.
:::

# Exercice 72 p. A35 {.w-1--2}

::: exercise
Trouvez toutes les valeurs $x \in [0, 2\pi]$ qui satisfont l'équation
$$2 + \cos 2x = 3 \cos x$$
:::

::: hint
Les arguments à gauche et à droite sont différents.
Réfléchissez à quelle formule employer pour remplacer $\cos 2x$,
essayez de limiter le nombre de fonctions trigonométriques en jeu!
:::

# Exercice 76 p. A35 {.w-1--2}

::: exercise
Trouvez toutes les valeurs $x \in [0, 2\pi]$ qui satisfont l'inéquation
$$\sin x > \cos x$$
:::

::: hint
Résolvez d'abord $\sin x = \cos x$ et tracer le cercle trigonométrique.
:::

# Exercice ajouté 1/2 {.w-1--2}

::: exercise
Trouvez toutes les solutions de l'équation
$$\sqrt 3 \cos x - \sin x = 1$$
:::

::: hint
Tentez de réécrire le membre de gauche comme $A \cos(x + \varphi)$.
:::

::: remark
Physiquement, le membre de gauche correspond à la superposition de deux ondes de mêmes fréquences mais d'amplitudes différentes.
:::

# Exercice ajouté 2/2 {.w-1--2}

::: exercise
Trouvez toutes les solutions de l'inéquation
$$
\sqrt 3 \sin 2x - \cos 2x \leq -1
$$
:::

::: hint
- Tentez de réécrire le membre de gauche comme $A \cos(x + \varphi)$.
- Résolvez l'équation avant l'inéquation
:::

# Réponses

<Iframe class="w-full h-full" src="/documents/pm1c-answers.pdf#page=3&zoom=page-fit" />
