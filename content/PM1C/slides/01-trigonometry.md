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
- **Allez à la bonne séance d'exercice**: les enseignants tourneront

# À propos de ce cours {.w-1--2}

Objectifs
: Rappels du secondaire dont vous aurez besoin cette année

Théorie
: Khôi Nguyễn (NGY)

Exercices
: Rolando Guerrieri, Marius Joly, Ruben Hillewaere, Khôi Nguyễn

Resources
: 
  - [Calculus](https://www.stewartcalculus.com/)
  - [Exercices du baccalauréat britannique](https://www.physicsandmathstutor.com/maths-revision/a-level-edexcel/)
  - [Plateforme d'apprentissage ECAM](/) (en construction)
  - [Slides annotés](/PM1C)

# Où trouver les slides?

:::::::::: {.columns-2 .h-full .p-4 .pb-12}
::::: {.column .h-full}

<Iframe src="/PM1C" class="border rounded-xl shadow p-4 w-full h-4/5" />

:::::
::::: column

#. Allez sur https://nguyen.me.uk
#. Cliquez sur "Pont maths"

:::::
::::::::::

# Comment s'entraîner sur la plateforme?

:::::::::: {.columns-2 .h-full .p-4 .pb-12}
::::: {.column .h-full}

<Iframe src="/" class="border rounded-xl shadow p-4 w-full h-4/5" />

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

# Conversion: exemple {.w-1--2}

::: {.example title="D.1"}
a. Convertir $60^\circ$ en radians
b. Exprimer $5 \pi / 4$ en degrés
:::

::: {.solution .columns .columns-2}
a. <Calculator value="60 \cdot \frac{\pi}{180}" />
b. <Calculator value="\frac{5\pi}{4} \cdot {\frac{180}{\pi}}" />
:::

# Longueur d'arc {.w-1--2}

::: {.proposition title="Longueur d'arc"}
$$
L = r \theta
$$
:::

::: exemple
a. Si le rayon d'un cercle est $5$ cm,
   quel angle est sous-tendu par un arc de $6$ cm?
b. Si un cercle a un rayon de $3$ cm,
   quel est la longueur de l'arc sous-tendu par un angle au centre de $3 \pi / 8$?
:::

::: {.solution .columns .columns-2}
a. <Calculator value="\frac{6}{5}" />
b. <Calculator value="3 \cdot 3 \frac{\pi}{8}" />
:::

# Rapports trigonométriques {.w-1--2}

![Noms des côtés d'un triangle rectangle](/images/sohcahtoa.svg){.mx-auto .h-64}

::: {.definition title="Rapports trigonométriques"}
$$
  \sin \theta = \frac {\text{opposé}} {\text{hypothénuse}}\\
  \cos \theta = \frac {\text{adjacent}} {\text{hypothénuse}}\\
  \tan \theta = \frac {\text{opposé}} {\text{adjacent}}\\
$$
:::

::: question
Les membres de gauche mentionnent $\theta$,
pourquoi n'apparaît-il pas à droite?
:::

# Cercle trigonométrique {.w-1--2}

<Geogebra id="yyufnmy9" width={1000} heigth={850} />

- **Cercle trigonométrique**: rayon $1$ centré à l'origine.
- $\alpha$: angle de $AM$ avec l'axe $O x$,
  longueur d'arc si en radians
- $M (\cos \alpha, \sin \alpha)$

# Périodicité, symétrie, angles associés {.w-1--2}

::: {.proposition title="Périodicité"}
- $\sin (x + 2 \pi) = \sin x$
- $\cos (x + 2 \pi) = \cos x$
- $\tan (x + \pi) = \tan x$
:::

::: {.proposition title="Parité"}
- $\sin (-\theta) = -\sin \theta$
- $\cos (-\theta) = \cos \theta$
- $\tan (-\theta) = -\tan \theta$
:::

# Angles associés

<Geogebra width={1100} height={800} id="vtpzkefz" />

# Équations trigonométriques {.w-1--2}

::: example
$$
\cos x = \frac 1 2
$$
:::

::: warning
La calculatrice ne donne qu'**une seule** réponse.

<Calculator value="\arccos(\frac 1 2)" />

Utilisez le cercle trigonométrique pour trouver les autres.
:::

# Graphes trigonométriques

<Geogebra id="eVGq4u6M" height={450} class="border scale-125 translate-y-1/4 mx-auto" />

# Graphes

~~~ yaml {.plot}
class: mx-auto
xAxis: { domain: [-10, 10] }
data:
  - fn: sin(x)
  - fn: cos(x)
  - fn: tan(x)
width: 1800
height: 900
~~~

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

# Formules d'addition: preuve par image {.w-1--2}

![](/images/addition_formulae_proofs.png){.w-3--4 .mx-auto}

# Formules d'addition {.w-1--2}

::: {.proposition title="Formules d'addition"}
$$
\sin (x \pm y) = \sin x \cos y \pm \cos x \sin y\\
\cos (x \pm y) = \cos x \cos y \mp \sin x \sin y\\
\tan (x \pm y) = \frac {\tan x \pm \tan y} {1 \mp \tan x \tan y}
$$
:::

En prenant $y = x$,
on obtient les formules de **duplication** suivantes:

::: {.proposition title="Formules de duplication"}
$$
\sin 2x = 2 \sin x \cos x\\
\cos 2x = \cos^2 x - \sin^2 x\\
\tan 2x = \frac {2 \tan x} {1 - \tan^2 x}
$$
:::

# Équations trigonométriques: exemple {.w-1--2}

::: example
Trouvez toutes les valeurs de $x \in [0, 2\pi]$ telles que $\sin x = \sin 2x$.
:::

<Calculator />

# Exercices corrigés issus du baccalauréat britannique {.w-1--2}

<Iframe src="https://pmt.physicsandmathstutor.com/download/Maths/A-level/Pure/Trigonometry-2/Edexcel-Set-B/Trigonometric%20Identities.pdf" class="w-full h-3/4" />

<Calculator />

# Question de niveau examen: Q1 {.w-1--2}

::: example
a. Démontre que
   $$
   1 - \cos 2x = \tan x \sin 2 x,
   \quad x \neq \frac {(2n + 1) \pi} 2
   $$

b. Dès lors, résolvez l'équation
   $$
   (\tan^2 x - 4) (1 - \cos 2x) = 3 \tan^2 x \sin 2x.
   $$
   dans l'intervalle $[-\frac {\pi} 2, \frac \pi 2]$
:::

<Calculator />