---
title: Utiliser le Web
slideshow: true
---

# Table des matières {.grid .grid-cols-2}

::: col
### Aujourd'hui

- Pourquoi utiliser le Web pour créer ses ressources?

- Comment fonctionne la correction symbolique?

- Projet "Learning" de l'ECAM
:::

::: col
### Qui suis-je?

- Ancien étudiant de l'UCL (2008-2011) en mathématiques

- Enseignant en mathématiques et informatique à l'ECAM

- Développeur du projet *learning@ecam*

- Learning: [https://learning.ecam.be](https://learning.ecam.be) (prototype)

  - Projet pédagogique open source
  - Faciliter la création de ressources interactives:
    - exercices générés, corrigés et personnalisés
    - slides interactifs
:::

# Pourquoi le Web?

::: question
Pourquoi utiliser le Web pour créer des ressources?
:::

- Interactivité riche

- Différenciation/individualisation

- Rapide à créer des ressources

# Interactivité 

::::: {.flex .items-center .gap-12 .justify-around}
<div class="rounded-xl shadow px-8">
<Geogebra id="Z5Nvhks7" height={500} />
</div>

::: div
Une page Web peut facilement intégrer des **animations**
:::
:::::

# Interactivité: programmation {.flex .items-center .gap-12 .justify-center}

::: col
```python {.run runImmediately=true}
from sympy import *
x = Symbol("x")
diff(x**2 - 5*x + 6)
```

```javascript {.run framework=svelte runImmediately=true}
<script>
  let attempt = ''
</script>

<p>3 + 4 = ?</p>
<input bind:value={attempt} />

{#if attempt === '7'}
  <p>La réponse est en effet 7!</p>
{:else if attempt !== ''}
  <p>La réponse {attempt} n'est pas correcte</p>
{/if}
```
:::

::: col
On peut également diminuer la barrière d'entrée à la programmation
:::

# Interactivité: en pratique {.flex .items-center .justify-around}

::::: {.grow}

- à gauche: support, rappels, formules, outils
- à droite: tableau blanc pour la prise de note
- Exécution de code
:::::

<div class="relative z-30 border shadow-md rounded-xl max-w-[1440px] max-h-[817.5px] overflow-hidden">
<div class="scale-75 origin-top-left">
<Iframe class="w-[1920px] h-[1090px]" src="/PM1C/slides/01-trigonometry?boardName=A#15/1" />
</div>
</div>

# Mes ressources {.flex .gap-8}

::: {.self-center .grow}
- Point d'entrée de l'étudiant..e

- Cartographie de compétences (exercices générés et corrigés automatiquement)

- Liens vers les slides annotés
:::

<div class="relative z-30 border shadow-md rounded-xl max-w-[1440px] max-h-[817.5px] overflow-hidden self-center">
<div class="scale-75 origin-top-left">
<Iframe class="w-[1920px] h-[1090px]" src="/PM1C" />
</div>
</div>

# Différenciation {.w-1--2}

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

# Vue d'un exercice côté étudiant {.flex}

::: {.column .grow .self-center}
- Vue tablette

- Vidéos

- Aide à la saisie

- Correction automatique

- Compétences voisines
:::

<div class="relative z-30 border shadow-md rounded-xl max-w-[1440px] max-h-[817.5px] overflow-hidden self-center">
<div class="scale-75 origin-top-left">
<Iframe class="w-[1920px] h-[1090px]" src="/skills/algebra/factor/monic-quadratics" />
</div>
</div>

# Progrès d'un étudiant {.flex}

::: {.column .grow .self-center}
- Cartographies colorées

- Historique des exercices résolus

- Suggestion d'exercices
:::

<div class="relative z-30 border shadow-md rounded-xl max-w-[1440px] max-h-[817.5px] overflow-hidden self-center">
<div class="scale-75 origin-top-left">
<Iframe class="w-[1920px] h-[1090px]" src="https://learning.ecam.be/users/25220@ecam.be/math" />
</div>
</div>

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

# HTML en 2 minutes {.flex .items-center .justify-around}

~~~ html {.run runImmediately=true}
<h1>Ceci est un title</h1>
<h2>Ceci est un sous-titre</h2>
<p>Ceci est un paragraphe</p>

<p>Clickez <a href="https://uclouvain.be">ici!</a></p>
~~~

::: info
- Une page Web est un **fichier texte** ouverte par le navigateur

- Une page contient un mélange de **texte**
  et de **balises**:

  On parle d'**hypertext** (le language s'appellle *HyperText Markup Language* or *HTML*).

$$
\underbrace{\texttt{<h1>}}_{\substack{\text{balise} \\ \text{ouvrante}}}
\texttt{Ceci est un titre}
\underbrace{\texttt{</h1>}}_{\substack{\text{balise} \\ \text{fermante}}}
$$

$$
\underbrace{\texttt{<a}}_{\substack{\text{balise} \\ \text{ouvrante}}}
\overbrace{\texttt{href}}^{\text{\small attribut}}
\texttt{=}
\underbrace{\texttt{"https://uclouvain.be"}}_{\text{valeur}}
\texttt{>}
\texttt{ici} \underbrace{\texttt{</a>}}_{\substack{\text{balise} \\ \text{fermante}}}
$$
:::

# Le CSS {.w-1--2}

~~~ html {.run runImmediately=true}
<h1>Ceci est un title</h1>
<h2>Ceci est un sous-titre</h2>
<p>Ceci est un paragraphe</p>

<p>Cliquez <a href="https://uclouvain.be">ici!</a></p>

<style>
  h1 {
    border-bottom: 1px darkblue solid;
    color: darkblue;
  }
  a {
    color: darkgreen;
  }
</style>
~~~

# Composants {.w-1--2}

::: info
En Web moderne, il est possible de créer ses propres balises,
appelés **composants**.
:::

# Markdown {.w-3--4}

Pour du contenu relativement statique,
on utilise souvent un **langage intermédiaire**,
qui est ensuite transformé en HTML.

En particulier, vous pouvez y entrer du HTML,
et beaucoup de variantes de Markdown
**supportent même le $\LaTeX$**.


::: {.example title="Markdown converti en HTML"}
~~~ {.markdown .run runImmediately=true .grid .grid-cols-2 .gap-12}
# Titre

[UCL](https://uclouvain.be)

## Sous-titre

- liste
- liste

---

Texte en **gras**, *italique*.
$x^2$

$$
\int_a^b f'(x) \, \mathrm dx = f(b) - f(a)
$$
~~~
:::

# Démo

# Calcul numérique {.w-1--2}

L'**arithmétique** d'un ordinateur n'est pas suffisante pour la correction,
puisqu'un nombre (flottant) est stocké
en **notation scientifique binaire**
avec une précision fixée:

$$
(b_1 \cdot b_2 b_3 \dots b_p)_2 \cdot 2^p,
\quad b_i \in \{0, 1\}
$$

- Densité variable

  ::: {.grid .grid-cols-2}
  ```python {.run runImmediately=true}
  1 + 10 ** (-15)
  ```

  ```python {.run runImmediately=true}
  100 + 10 ** (-15)
  ```
  :::

- Précision et propagation des erreurs
  ($\frac 1 {10} = (0.0\overline{0011})_2$)

  ```python {.run runImmediately=true}
  0.1 * 0.1
  ```

# Calcul formel {.w-1--2}

::: {.definition title="Calcul formel"}
S'intéresse à la manipulation **symbolique**
d'expression en conservant l'égalité mathématique.
:::

- Arithmétique **exacte**

- **Simplifications**: factorisations, identités trigonométriques, distributivité, etc.

- Résolution d'équations

::: example
- GeoGebra

- SymPy
:::

# Correction automatique {.w-1--2}

::: question
Comment fonctionne la correction sur les plateformes telles que
Kahn Academy?
:::

::: hint
En employant le Web,
on peut automatiser les appels à des logiciels de calcul formel.
:::

# Représentation en arbre

<div class="w-1/2">
::: question
Comment fonctionne le calcul formel?
:::

Les expressions mathématiques sont représentées en **arbres**,
et on évite autant que possible l'arithmétique non-entière.

</div>

<SymbolicRepresentation class="z-50 relative flex gap-12 items-center" value="\frac{2}{3} + \frac{3}{4}" showJson />

# Perte d'information {.w-1--2}

::: info
Les logiciels de calcul formel
procèdent souvent à des transformations ou simplifications
automatiques.

Cela implique une perte d'information.
:::

::::: {.flex .gap-24 .justify-center}
<SymbolicRepresentation class="z-50 relative flex gap-12 items-center" value="x^2 - 5x + 6" />

<SymbolicRepresentation class="z-50 relative flex gap-12 items-center" value="\frac{4}{2}" />
:::::

# Transformations et simplifications {.w-1--2}

<SymbolicRepresentation class="z-50 relative flex gap-12 items-center" value="\frac{2}{3}" showJson />

~~~ typescript
type Fraction = ['Rational', number, number]

function add([_, a, b]: Fraction, [_, c, d]: Fraction) {
  return ['Rational', a * d + b * c, b * d]
}
~~~

# Égalité symbolique {.w-1--2}

Pour l'ordinateur,

::::: {.flex .justify-around}
<SymbolicRepresentation class="z-50 relative flex gap-12 items-center" value="x^2 - 1" hideField />

<SymbolicRepresentation class="z-50 relative flex gap-12 items-center" value="(x - 1)(x + 1)" hideField />
:::::

sont des expressions complètement différentes (structurellement).

::: question
Dans un système de correction,
comment vérifie-t-on l'**égalité symbolique**?
:::

- Mathématiquement, ce problème est **indécidable**.

- En secondaire, les expressions sont relativement simples:

  $$ A = B \iff \texttt{simplify}(A - B) = 0$$

# Égalité symbolique en pratique

<SymbolicEquality expr1="x^2 - 1" expr2="(x - 1)(x + 1)" />

# Exemple

::: example
Quel est le volume d'un cylindre de rayon $r$ et de hauteur $h$?
:::

<SymbolicExercise pre='r, h = symbols("r h")' answer="pi * r**2 * h" />