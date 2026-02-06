---
title: Projet e-cam
slideshow: true
---

# Statistiques 2025-2026 {.flex}

::::: {.grow .self-center}
- +450 utilisateurs et utilisatrices

- +350 ont résolu au moins un exercice

- Certain.es ont résolu jusqu'à 900 exercices

- ~46 000 exercices tentés en 7 semaines

- Utilisée pour:

  - Pont maths A
  - Programmation BA1

- Contributions par FKY, HIL, LUR, NGY.
:::::

<Iframe src="/stats" class="w-2/3 h-full rounded-xl border shadow-md" />

# Pont maths {.flex}

::::: {.grow .self-center}
- Ressources groupées par **thème**

  - Cours théoriques en direct
  - Exercices corrigés

- Cartographies des compétences

  - Compétences voisines
  - Couleurs en fonction de la maîtrise de l'étudiant.e

- Couverture presque complète des compétences
:::::

<Iframe src="/PM1C/" class="w-3/4 h-full rounded-xl border shadow-md" />

# Cours théorique {.flex}

::::: {.grow .self-center}
- Slides annotés en direct

- Exécution de code

- Interactivité riche
:::::

<Iframe class="w-3/4 h-full rounded-xl border shadow-md" src="https://learning.ecam.be/PM1C/slides/01-trigonometry/15/1?boardName=A" />

# Cartographies personnalisées des contenus {.flex .gap-8}

::::: {.self-center}
::: info
Les cartographies sont générées automatiquement.
:::

### Cartographies locales

::: break-inside-avoid
~~~ {.tsx .raw .break-inside-avoid}
<ChapterInfo title="Droites et Coniques" query={{
  "page": {
    OR: [
      { "title": { contains: "premier degré" } },
      { "title": { contains: "hyperbole" } },
      { "title": { contains: "parabole" } },
      { "title": { contains: "ellipse" } },
      { "title": { contains: "cercle" } },
      { "title": { contains: "conique" } },
    ]
  }
}}>
  <Resource type="theory" href="/PM1C/slides/02-vectors?boardName=A">CT 2A</Resource>
  <Resource type="theory" href="/PM1C/slides/02-vectors?boardName=B">CT 2B</Resource>
  <Resource type="handout" href="/PM1C/slides/02-vectors?print=true">CT 2</Resource>
  <Resource type="exercise" href="/PM1C/exercises/03-vectors">EX 3</Resource>
  <Resource type="exercise" href="/PM1C/exercises/04-vectors">EX 4</Resource>
  <Resource type="exercise" href="/PM1C/exercises/05-vectors">EX 5</Resource>
</ChapterInfo>
~~~
:::
:::::

::::: grow
### Cartographie globales
 
~~~ {.tsx .raw}
<Graph
  class="border rounded-xl w-full h-[800px]"
  query={{ courses: { some: { code: 'PM1C' } } }}
  groups={['algebra', 'geometry', 'calculus', 'trigonometry']}
/>
~~~
:::::

# Vue d'un exercice côté étudiant {.flex}

::: {.column .grow .self-center}
- Vue tablette

- Aide à la saisie

- Compétences voisines
:::

<Iframe src="/skills/algebra/factor/monic-quadratics" class="border rounded-xl shadow-xl w-4/5 h-full" />

# Vue d'un exercice côté enseignant {.flex}

::: {.column .grow .self-center}
- Score ELO pour quantifier la difficulté perçue

- Résultats par étudiant.e
:::

<Iframe src="/results/skills/algebra/factor/monic-quadratics" class="border rounded-xl shadow-xl w-2/3 h-full" />

# Progrès d'un étudiant {.flex}

::: {.column .grow .self-center}
- Cartographies colorées

- Historique des exercices résolus

- Suggestion d'exercices
:::

<Iframe src="https://learning.ecam.be/users/25220@ecam.be/math" class="border rounded-xl shadow-xl w-2/3 h-full" />

# Moteur d'exercices

::::: {.flex .justify-around}
::: self-center
Un exercice est **défini** précisément...
:::

~~~ yaml {.run .flex .flex-row-reverse .justify-end .gap-16 .border .rounded-xl .shadow-sm .p-4}
type: Factor
question:
  expr: (x - 2)(x - 3)(x - 1)
  expand: true
~~~
:::::

::::: {.flex .justify-around}
::: self-center
ou il peut être **généré**...
:::

~~~ yaml {.run .flex .flex-row-reverse .justify-end .gap-16 .border .rounded-xl .shadow-sm .p-4}
type: Factor
params:
  roots:
    product:
      - [0]
      - [-3, -2, -1, 1, 2, 3]
      - [-3, -2, -1, 1, 2, 3]
~~~
:::::

# Chimie, informatique

L'outil est suffisament versatile pour répondre aux besoins des collègues.

::::: {.flex .justify-around}
::: self-center
De la **chimie**...

::::: {.text-slate-500 .text-sm}
(Notez que le système comprend réellement la stoechiométrie)
:::::
:::

~~~ yaml {.run .flex .flex-row-reverse .justify-end .gap-16 .border .rounded-xl .shadow-sm .p-4}
type: Balance
question:
  reactants: [Na, H2O]
  products: [NaOH, H2]
~~~
:::::

::::: {.flex .justify-around}
::: self-center
à l'**informatique**...

:::::: {.text-slate-500 .text-sm}
(où aucun setup n'est nécessaire)
::::::
:::

~~~ yaml {.run .flex .flex-row-reverse .justify-end .gap-16 .border .rounded-xl .shadow-sm .p-4}
type: Output
question:
  code: |
    a = 3
    b = 4
    print(a + b)
~~~
:::::

# Test diagnostique {.flex}

::: {.grow .self-center}
- Pas de soucis de performance
- Bug rendant les résultats inutilisables
- Trop précipité 7/10/2026
:::

<Iframe class="w-3/4 h-full rounded-xl border shadow-md" src="https://learning.ecam.be/results/PM1C/diagnostic-test-group-2" />

# Réunions et retours

### Réunion FGS

- Beaucoup d'exercices "simples"

  ~~~ yaml {.border .rounded-xl .p-4 .run .flex .flex-row-reverse .justify-end .gap-16 .text-xs}
  type: Calculate
  params:
    type: withParams
    questions:
      - text: |
          Deux points matériels ont comme masse ${m1}$ kg et ${m2}$ kg,
          et se trouvent à une distance de ${d}$ mètres.
  
          Déterminez l'intensité de la force gravitationnelle
          entre ces deux objets.
        label: F
        unit: N
        expr: \frac {{G} {m1} {m2}} {{d}^2}
        error: 0.1
    subs:
      G: 6.6743 \cdot 10^{-11}
      m1: [200, 300, 400, 500, 600, 700]
      m2: [200, 300, 400, 500, 600, 700]
      d: [25, 50, 100, 200, 300]
  ~~~

- Exercices avec **plusieurs étapes** $\to$ impossible pour le moment.

### Avec Ruben

- Correction comme à l'examen (crédit partiel) $\to$ impossible

- **Feedback** détaillé $\to$ difficile

# Stages et consultants {.w-1--2}

- Pas de contribution de code de la part du consultant pour le moment.
  Beaucoup de temps investi pour former l'étudiant.

- Projet difficile pour des étudiants,
  principalement à cause de l'aspect calcul symbolique.

- Stages reportés $\to$ congé paternité,
  et nécessité d'améliorations du coeur (trop difficile).

# Développement futur {.w-1--2}

::: column
- **2025-2026**: amélioration du coeur

  - Couverture de test
  - Feedback riche
  - Exercices par étapes
  - Améliorer l'expérience enseignant

- **Q1 2026**: documentation pour les stagiaires

- **Q2 2027**: supervisions de stage pour réécrire les exercices courants,
  et ajouter des exercices de FGS.
:::

# Ressenti {.w-1--2}

- *À court terme*, les besoins de **developpement** excèdent de loin ceux de pédagogie.

- Pérennité: quelle ligne directrice s'il y a une incertitude pour l'année suivante?

- Former des stagiaires demande du **temps**,
  peu de différence entre 1 et 4 stagiaires.