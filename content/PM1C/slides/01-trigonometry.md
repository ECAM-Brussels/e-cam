---
title: Trigonométrie
slideshow: true
---

# Bienvenue à l'ECAM {.w-1--2}

Bienvenue à tou.te.s!

Je vous souhaite une excellente année académique,
en espérant qu'elle soit fructueuse, enrichissante, instructive,
et pleine de belles rencontres!

### Quelques règles

- **Ponctualité**: à l'heure ou *15 minutes* après
- **Respect du temps de parole**
- **Respect mutuel et de l'apprentissage du groupe**

# À propos de ce cours {.w-1--2}

Objectifs
: Rappels du secondaire dont vous aurez besoin cette année

Théorie
: Khôi Nguyễn (NGY)

Exercices
: Ruben Hillewaere, Khôi Nguyễn

Resources
: 
  - [Calculus](https://www.stewartcalculus.com/)
  - [Exercices du baccalauréat britannique](https://www.physicsandmathstutor.com/maths-revision/a-level-edexcel/)
  - [Plateforme d'apprentissage ECAM](/) (en construction)
  - [Slides annotés](/PM1C)

# Où trouver les slides?

:::::::::: {.columns-2 .h-full .p-4 .pb-12}
::::: {.column .h-full}

<Iframe src="/PM1C" class="border rounded-xl shadow p-4 w-full h-full" />

:::::
::::: column

#. Allez sur https://nguyen.me.uk
#. Cliquez sur "Pont maths"

:::::
::::::::::

# Comment s'entraîner sur la plateforme?

:::::::::: {.columns-2 .h-full .p-4 .pb-12}
::::: {.column .h-full}

<Iframe src="/" class="border rounded-xl shadow p-4 w-full h-full" />

:::::
::::: column

#. Allez sur https://nguyen.me.uk
#. Connectez-vous avec votre compte ECAM
#. Trouvez les préparations sur la page du cours

:::::
::::::::::

# Radians et degrés {.w-1--2}

Le **degré** et le **radian** sont deux *unités d'angle* proportionnelles satisfaisant

$$
  1 \, \text{tour} = 2 \pi \, \text{rad} = 360^\circ
$$

-----     ---        ---             ---             ---              ---
Degrés    $0^\circ$  $30^\circ$      $45^\circ$      $60^\circ$       $90^\circ$
Radians   $0$        $\frac \pi 6$   $\frac \pi 4$   $\frac \pi 3$    $\frac \pi 2$
-----     ---        ---             ---             ---              ---

::: {.question title="Conversion"}
$$
\text{degrés}
\quad \overset{\times \frac \pi {180}}{\longrightarrow} \quad
\text{radians}
\qquad
\qquad
\text{radians}
\quad \overset{\times \frac {180} \pi}{\longrightarrow} \quad
\text{degrés}
$$
:::

::: {.remark title="Utilisation du radian"}
- On emploie les degrés dans la vie de tous les jours
- Certaines formules sont plus faciles en radians,
  e.g. $\sin' = \cos$.
:::

# Rapports trigonométriques {.w-1--2}

::: {.definition title="Rapports trigonométriques"}
$$
  \sin \theta = \frac {\text{opposé}} {\text{hypothénuse}}\\
  \cos \theta = \frac {\text{adjacent}} {\text{hypothénuse}}\\
  \tan \theta = \frac {\text{opposé}} {\text{adjacent}}\\
$$
:::

# Cercle trigonométrique

<Geogebra id="yyufnmy9" width={1000} heigth={850} />

# Périodicité, symétrie, angles associés {.w-1--2}

::: {.proposition title="Périodicité"}
- $\sin (x + 2 \pi) = \sin x$
- $\cos (x + 2 \pi) = \cos x$
- $\tan (x + \pi) = \tan x$
:::

# Angles associés

<Geogebra width={1100} height={800} id="vtpzkefz" />

# Identités fondamentales {.w-1--2}

::: {.proposition title="Identités fondamentales"}
$$
\sin^2 x + \cos^2 x = 1\\
\tan^2 x + 1 = \frac 1 {\cos^2 x}\\
1 + \cot^2 x = \frac 1 {\sin^2 x}
$$
:::

- La première identité découle de **Pythagore**.
- On divise par $\cos^2 x$ et $\sin^2 x$ respectivement
  pour trouver les autres.

# Formules d'addition: découverte

<Geogebra class="mx-auto" id="t5zqcQ4z" width={1300} height={900} />

# Formules d'addition {.w-1--2}

::: {.proposition title="Formules d'addition"}
$$
\sin (x \pm y) = \sin x \cos y \pm \cos x \sin y\\
\cos (x \pm y) = \cos x \cos y \mp \sin x \sin y\\
\tan (x \pm y) = \frac {\tan x \pm \tan y} {1 \mp \tan x \tan y}
$$
:::