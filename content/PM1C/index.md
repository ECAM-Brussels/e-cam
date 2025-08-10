---
title: 'Pont vers le supérieur: mathématiques'
---

# Pont vers le supérieur : mathématiques

![Pont mathématiques](/images/PM1C.png){.w-full .lg:max-h-96 .max-h-84 .object-cover .rounded-xl}

~~~ {.tsx .raw}
<div class="grid lg:grid-cols-2 gap-4 mb-4">
  <ChapterInfo title="Chapitre 1: Trigonométrie" query={{ "courses": { "some": { "code": "trigonometry" } } }}>
    <Resource type="theory" href="/PM1C/slides/01-trigonometry">CT 1</Resource>
    <Resource type="exercise" href="/PM1C/exercises/01-trigonometry">EX 1</Resource>
    <Resource type="exercise" href="/PM1C/exercises/02-trigonometry">EX 2</Resource>
  </ChapterInfo>
  <ChapterInfo title="Chapitre 2: Vecteurs">
    <Resource type="theory" href="/PM1C/slides/02-vectors">CT 2</Resource>
    <Resource type="exercise" href="/PM1C/exercises/03-vectors">EX 3</Resource>
    <Resource type="exercise" href="/PM1C/exercises/04-vectors">EX 4</Resource>
    <Resource type="exercise" href="/PM1C/exercises/05-vectors">EX 5</Resource>
  </ChapterInfo>
  <ChapterInfo title="Chapitre 3: Algèbre et systèmes" query={{ "courses": { "some": { "code": "algebra " } } }}>
    <Resource type="theory" href="/PM1C/slides/03-algebra">CT 3</Resource>
    <Resource type="exercise" href="/PM1C/exercises/06-algebra">EX 6</Resource>
    <Resource type="exercise" href="/PM1C/exercises/07-simultaneous-equations">EX 7</Resource>
  </ChapterInfo>
  <ChapterInfo title="Chapitre 4: Droites et Coniques">
    <Resource type="theory" href="/PM1C/slides/04-straight-lines-and-conic-sections">CT 4</Resource>
    <Resource type="exercise" href="/PM1C/exercises/08-straight-lines">EX 8</Resource>
    <Resource type="exercise" href="/PM1C/exercises/09-conic-sections">EX 9</Resource>
  </ChapterInfo>
  <ChapterInfo title="Chapitre 5: Nombres complexes">
    <Resource type="theory" href="/PM1C/slides/05-complex-numbers">CT 5</Resource>
    <Resource type="exercise" href="/PM1C/exercises/10-complex-numbers">EX 10</Resource>
    <Resource type="exercise" href="/PM1C/exercises/11-complex-numbers">EX 11</Resource>
  </ChapterInfo>
  <ChapterInfo title="Chapitre 6: Fonctions et limites">
    <Resource type="theory" href="/PM1C/slides/06-functions">CT 6</Resource>
    <Resource type="theory" href="/PM1C/slides/07-limits">CT 7</Resource>
    <Resource type="exercise" href="/PM1C/exercises/12-functions">EX 12</Resource>
    <Resource type="exercise" href="/PM1C/exercises/13-functions-and-limits">EX 13</Resource>
    <Resource type="exercise" href="/PM1C/exercises/14-limits">EX 14</Resource>
  </ChapterInfo>
  <ChapterInfo title="Chapitre 7: Dérivées">
    <Resource type="theory" href="/PM1C/slides/08-differentiation">CT 6</Resource>
    <Resource type="exercise" href="/PM1C/exercises/15-differentiation">EX 15</Resource>
    <Resource type="exercise" href="/PM1C/exercises/16-differentiation">EX 16</Resource>
  </ChapterInfo>
</div>
<Graph
  class="border rounded-xl w-full h-[1600px]"
  query={{ courses: { some: { code: 'PM1C' } } }}
  groups={['algebra', 'calculus', 'trigonometry', 'geometry']}
/>
~~~
