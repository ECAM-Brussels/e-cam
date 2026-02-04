---
title: Projet e-cam
slideshow: true
---

# Statistiques 2025-2026 {.flex}

::::: {.grow .self-center}
- 477 utilisateurs et utilisatrices

- 356 ont résolu au moins un exercice

- Certain.es ont résolu jusqu'à 890 exercices

- 45 387 exercices tentés en 7 semaines

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

- Cartographies personnalisées locales des compétences

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
:::

<Iframe src="https://learning.ecam.be/users/25199@ecam.be/math" class="border rounded-xl shadow-xl w-2/3 h-full" />

# Moteur d'exercices

::::: {.flex .justify-around}
::: self-center
Un exercice est **défini** précisément...
:::

~~~ yaml {.run .flex .flex-row-reverse .justify-end .gap-16 .border .rounded-xl .shadow-sm .p-4}
type: Factor
question:
  expr: x^2 - 5x + 6
~~~
:::::

::::: {.flex .justify-around}
::: self-center
ou il peut être **généré**...
:::

~~~ yaml {.run .flex .flex-row-reverse .justify-end .gap-16 .border .rounded-xl .shadow-sm .p-4}
type: Factor
params:
  A: [1]
  roots:
    product:
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

# Réunion FGS

- Beaucoup d'exercices "simples"

~~~ yaml {.run .flex .flex-row-reverse .justify-end .gap-16}
type: Simple
question:
  text: Donnez la formule de la loi de gravitation universelle.
  label: $F =$
  unit: N
  answer: $\frac {G m_1 m_2} {r^2}$
~~~

- **Feature manquante**: exercices avec **plusieurs étapes**.

  $\to$ Réécriture profonde.

# Leçons {.w-1--2}

- **Correction symbolique**

  - Suffisament puissante pour nos cas d'utilisations
  - Pas de problèmes de ressources
  - Feedback riche difficile $\to$ solution trouvée

- **Développement**

  - Jusqu'à présent prototypage $\to$ plus de tests
  - Ralentir le cycle de développement