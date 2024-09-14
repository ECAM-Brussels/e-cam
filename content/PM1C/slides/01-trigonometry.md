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
: Rolando Guerrieri, Marius Joly, Ruben Hillewaere, Khôi Nguyễn

Resources
: 
  - [Calculus](https://www.stewartcalculus.com/) (ressource principale)
  - [Exercices du baccalauréat britannique](https://www.physicsandmathstutor.com/maths-revision/a-level-edexcel/) (exercices supplémentaires)
  - [Plateforme d'apprentissage ECAM](/) (en construction)
  - [Slides annotés](/PM1C)

# À propos des séances d'exercices {.columns-2}

::: h-full
- Faites la **préparation**
- Allez dans **votre** série
- Au *début* de la session,
  posez vos questions sur la préparation.
- Faites les exercices individuellement ou en groupe,
  et posez vos questions aux enseignants.
  On ne résoudra pas les exercices pour vous.
:::

::: h-full
<Iframe src="/PM1C" class="border rounded-xl shadow p-4 w-full h-4/5" />
:::

# Où trouver les ressources? {.columns-2 .h-full}

::: h-full
<Iframe src="/PM1C" class="border rounded-xl shadow p-4 w-full h-4/5" />
:::

::: h-full
#. Allez sur https://learning.ecam.be
#. Cliquez sur "Pont maths"
:::

# Livres du baccalauréat britannique {.columns-2 .h-full}

::: h-full
<Iframe class="border rounded-xl shadow w-full h-full" src="https://www.physicsandmathstutor.com/maths-revision/solutionbanks/" />
:::

::: h-full
Pour des exercices similaires **corrigés**,
nous ferons référence aux livres Edexcel (édition 2017).

- [Livres (Google drive)](https://drive.google.com/drive/folders/1qlM5jFw9kGTm45a8BtpQGopIivsvgH-4)
- [Solutions](https://www.physicsandmathstutor.com/maths-revision/solutionbanks/)

Étant un livre du secondaire,
le rhythme y est un peu plus lent.
:::

# Rappels {.w-1--2} 

#. Radians et degrés (pp. A24-A25)
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
#. Longueur d'arc (pp. A24-A25)
   $$
   L = r \theta, \quad \theta \text{ en radians}
   $$
#. Rapports trigonométriques (pp. A26)
   $$
     \sin \theta = \frac {\text{opposé}} {\text{hypothénuse}} \quad
     \cos \theta = \frac {\text{adjacent}} {\text{hypothénuse}} \quad
     \tan \theta = \frac {\text{opposé}} {\text{adjacent}}
   $$

   ![](/images/sohcahtoa.svg){.mx-auto .h-64}
#. Pythagore ($c^2 = a^2 + b^2$)

# Cercle trigonométrique {.w-1--2}

<Geogebra id="yyufnmy9" width={1000} heigth={850} />

- **Cercle trigonométrique**: rayon $1$ centré à l'origine.
- $\alpha$: angle de $AM$ avec l'axe $O x$,
  longueur d'arc si en radians
- $M (\cos \alpha, \sin \alpha)$

# Trouver les autres nombres trigonométriques (p. A27) {.w-1--2}

::: {.example title="Exemple 4 p. A27"}
Si $\cos \theta = \frac 2 5$ et $0 < \theta < \frac \pi 2$,
trouvez les autres nombres trigonométriques.
:::

::: remark
- Vous ferez un exercice très similaire en séance.
- Exercices 29-34 (Appendice D)
:::

# Calculer des angles ou des longueurs (p. A27) {.w-1--2}

::: {.example title="Exemple 5 p. A27"}
Soit un triangle rectangle avec un angle de $40^\circ$ dont le côté opposé a comme longueur $16$.
Que vaut $x$, la longueur du côté adjacent?
:::

::: {.remark title="Exercices similaires"}
Appendice D: 35-38
:::

<Calculator />

# Découverte: $\sin(a + b)$, $\cos(a + b)$ {.w-1--2}

![](/images/addition_formulae_proofs.png){.w-3--4 .mx-auto}

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

# Identités trigonométriques (p. A34) {.w-1--2}

::: {.exercise title="Exercices 52, 54 p. A34"}
Prouvez les identités suivantes:

- $$\frac 1 {1 - \sin \theta} + \frac 1 {1 + \sin \theta} = 2 \sec^2 \theta$$


- $$\sin^2 x - \sin^2 y = \sin(x + y) \sin(x - y)$$
:::

::: {.remark title="Exercices supplémentaires"}
- Appendice D: 42-58
- Pure Year 1: [10.3](https://activeteach-prod.resource.pearson-intl.com/r00/r0066/r006621/r00662110/current/alevelsb_p1_ex10c.pdf)
:::

# Équations trigonométriques (p. A30) {.w-1--2}

::: {.example title="Exemple 7 p. A30"}
Résolvez l'équation $\sin x = \sin 2x$ dans l'intervalle $[0, 2 \pi]$.

Réponse: $0$, $\frac \pi 3$, $\pi$, $\frac {5 \pi} 3$ et $2 \pi$
:::

<Calculator />

::: {.remark title="Exercices supplémentaires"}
- Appendice D: 65-72
- Pure year 1:
  - [10.4](https://activeteach-prod.resource.pearson-intl.com/r00/r0066/r006621/r00662110/current/alevelsb_p1_ex10c.pdf) 
  - [10.5](https://activeteach-prod.resource.pearson-intl.com/r00/r0066/r006621/r00662112/current/alevelsb_p1_ex10e.pdf)
  - [10.6](https://activeteach-prod.resource.pearson-intl.com/r00/r0066/r006621/r00662113/current/alevelsb_p1_ex10f.pdf)
- Pure year 2: 7.4, 7.5, 7.6
:::

# Exercices supplémentaires: identités trigonométriques {.w-1--2}

<Iframe class="h-full w-full" src="https://pmt.physicsandmathstutor.com/download/Maths/A-level/Pure/Trigonometry-2/Edexcel-Set-B/Trigonometric%20Identities.pdf" />

# Exercices supplémentaires: équations trigonométriques {.w-1--2}

<Iframe class="h-full w-full" src="https://pmt.physicsandmathstutor.com//download/Maths/A-level/Pure/Trigonometry-2/Edexcel-Set-B/Trigonometric%20Equations.pdf" />