---
title: Trigonométrie I
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="Exercise 32"}
Trouvez les autres nombres trigonométriques sachant que
$$\cos x = -\frac 1 3, \quad \pi < x < \frac {3 \pi} 2$$

::::: text-sm
**Réponses**: $\sin x = -\frac 2 3 \sqrt 2$, $\tan x = 2 \sqrt 2$, $\cot x = \frac {\sqrt 2} 4$
:::::
:::

::: {.exercise title="Exercise 36"}
Trouvez la valeur de $x$.
<RightTriangle c="25\text{cm}" a="x" B="40^{\circ}" width={275} height={275} />

::::: text-sm
Réponse: 19.15111 cm
:::::
:::

::: {.exercise title="Exercise 46"}
Prouvez que $(\sin x + \cos x)^2 = 1 + \sin 2x$.
:::

::: {.exercise title="Exercise 48"}
Prouvez que $\tan^2 \alpha - \sin^2 \alpha = \tan^2 \alpha \sin^2 \alpha$.
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

# Exercice 33 p. A34 {.w-1--2}

::: exercise
Trouvez les valeurs exactes des autres nombres trigonométriques.

$$
\cot \beta = 3, \quad \pi < \beta < \frac {3 \pi} 2
$$
:::

::: {.warning .text-sm}
Vos réponses doivent être **exactes**.
Il n'est donc pas permis de faire
<Calculator value="\beta = \arctan(\frac{1}{3})" />
car vous perdrez en précision.
:::

::: hint
- Exercice similaire: exemple 4 p. A27
- Certaines formules (pp. A28-A30) relient $\cot$ à exactement un seul autre nombre trigonométrique.
  Essayez de les utiliser.
:::

::: text-sm
**Réponse:** $\sin \beta = -\frac 1 {\sqrt {10}}$, $\cos \beta = -\frac 3 {\sqrt {10}}$, $\tan \beta = \frac 1 3$.
:::

# Exercice 51 p. A34 {.w-1--2}

::: exercise
Sans utiliser les formules $\tan(a + b)$ et $\tan(2a)$,
montrez que
$$
\tan 2\theta = \frac {2 \tan \theta} {1 - \tan^2 \theta}
$$
:::

::: hint
Revenez en $\sin$ et $\cos$.
:::

# Exercice 53 p. A34 {.w-1--2}

::: exercise
Prouvez que
$$\sin x \sin 2x + \cos x \cos 2x = \cos x$$
:::

::: hint
Deux arguments différents sont en jeu: $x$ et $2 x$.
Que pourriez-vous faire pour éliminer cette difficulté?
:::

# Exercice 55 p. A34 {.w-1--2}

::: exercise
Montrez que
$$
\frac {\sin \phi} {1 - \cos \phi} = \csc \phi + \cot \phi
$$
:::

::: hint
Il y a trop de fonctions trigonométriques différentes
:::

# Exercice 56 p. A34 {.w-1--2}

::: exercise
Montrez que
$$
\tan x + \tan y
= \frac {\sin (x + y)} {\cos x \cos y}
$$
:::

::: hint
Il y a trois types d'arguments différents en jeu: $x$, $y$ et $x + y$.
C'est sûrement un peu trop.
:::

# Exercice 57 p. A34 {.w-1--2}

::: exercise
Montrez que
$$
\sin 3\theta + \sin \theta = 2 \sin 2 \theta \cos \theta
$$
:::

# Exercices supplémentaires corrigés {.w-1--2}

<Iframe class="h-full w-full" src="https://pmt.physicsandmathstutor.com//download/Maths/A-level/Pure/Trigonometry-2/Edexcel-Set-B/Trigonometric%20Equations.pdf" />

# Réponses

<Iframe class="w-full h-full" src="/documents/pm1c-answers.pdf#page=3" />
