---
title: 'Pont vers le supérieur: mathématiques'
---

# Pont vers le supérieur : mathématiques

![Pont mathématiques](/images/PM1C.png){.w-full .lg:max-h-96 .max-h-84 .object-cover .rounded-xl}

::: {.flex .gap-4 .justify-center}
[Ressources](/PM1C/)

[Compétences](/PM1C/skills)

[Informations sur l'examen](/PM1C/exam)
:::

~~~ {.tsx .raw}
<div class="grid lg:grid-cols-2 gap-4 mb-4">
  <ChapterInfo title="Trigonométrie" query={{ "courses": { "some": { "code": "trigonometry" } } }}>
    <Resource type="theory" href="/PM1C/slides/01-trigonometry?boardName=A">CT 1A</Resource>
    <Resource type="theory" href="/PM1C/slides/01-trigonometry?boardName=B">CT 1B</Resource>
    <Resource type="handout" href="/PM1C/slides/01-trigonometry?print=true">CT 1</Resource>
    <Resource type="exercise" href="/PM1C/exercises/01-trigonometry">EX 1</Resource>
    <Resource type="exercise" href="/PM1C/exercises/02-trigonometry">EX 2</Resource>
  </ChapterInfo>
  <ChapterInfo title="Vecteurs" query={{
    "page": {
      OR: [
        { "title": { contains: "vect" } },
        { "title": { contains: "scalaire" } },
        { "title": { contains: "parallélé" } },
        { "title": { contains: "distance" } },
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
  <ChapterInfo title="Algèbre et systèmes" query={{
    "courses": { "some": { "code": "algebra " } },
    "page": {
      AND: [
        { "NOT": { title: { contains: "complex" } } },
        { "NOT": { title: { contains: "interpolation" } } },
      ],
    }
  }}>
    <Resource type="theory" href="/PM1C/slides/03-algebra?boardName=A">CT 3A</Resource>
    <Resource type="theory" href="/PM1C/slides/03-algebra?boardName=B">CT 3B</Resource>
    <Resource type="handout" href="/PM1C/slides/03-algebra?print=true">CT 3</Resource>
    <Resource type="exercise" href="/PM1C/exercises/06-algebra">EX 6</Resource>
    <Resource type="exercise" href="/PM1C/exercises/07-simultaneous-equations">EX 7</Resource>
  </ChapterInfo>
  <ChapterInfo title="Droites et Coniques" query={{
    "page": {
      OR: [
        { "title": { contains: "interpolation" } },
        { "title": { contains: "hyperbole" } },
        { "title": { contains: "parabole" } },
        { "title": { contains: "ellipse" } },
        { "title": { contains: "cercle" } },
        { "title": { contains: "conique" } },
      ]
    }
  }}>
    <Resource type="theory" href="/PM1C/slides/04-straight-lines-and-conic-sections?boardName=A">CT 4A</Resource>
    <Resource type="theory" href="/PM1C/slides/04-straight-lines-and-conic-sections?boardName=B">CT 4B</Resource>
    <Resource type="handout" href="/PM1C/slides/04-straight-lines-and-conic-sections?print=true">CT 4</Resource>
    <Resource type="exercise" href="/PM1C/exercises/08-straight-lines">EX 8</Resource>
    <Resource type="exercise" href="/PM1C/exercises/09-conic-sections">EX 9</Resource>
  </ChapterInfo>
  <ChapterInfo title="Nombres complexes" query={{
    "courses": { "some": { "code": "algebra" } },
    "page": {
      "title": { contains: "complex" },
    }
  }}>
    <Resource type="theory" href="/PM1C/slides/05-complex-numbers?boardName=A">CT 5A</Resource>
    <Resource type="theory" href="/PM1C/slides/05-complex-numbers?boardName=B">CT 5B</Resource>
    <Resource type="handout" href="/PM1C/slides/05-complex-numbers?print=true">CT 5</Resource>
    <Resource type="exercise" href="/PM1C/exercises/10-complex-numbers">EX 10</Resource>
    <Resource type="exercise" href="/PM1C/exercises/11-complex-numbers">EX 11</Resource>
  </ChapterInfo>
  <ChapterInfo title="Fonctions et limites" query={{
    "page": {
      "title": { contains: "limite" },
    }
  }}>
    <Resource type="theory" href="/PM1C/slides/06-functions?boardName=A">CT 6A</Resource>
    <Resource type="theory" href="/PM1C/slides/06-functions?boardName=B">CT 6B</Resource>
    <Resource type="handout" href="/PM1C/slides/06-functions?print=true">CT 6</Resource>
    <Resource type="theory" href="/PM1C/slides/07-limits?boardName=A">CT 7A</Resource>
    <Resource type="theory" href="/PM1C/slides/07-limits?boardName=B">CT 7B</Resource>
    <Resource type="handout" href="/PM1C/slides/07-limits?print=true">CT 7</Resource>
    <Resource type="exercise" href="/PM1C/exercises/12-functions">EX 12</Resource>
    <Resource type="exercise" href="/PM1C/exercises/13-functions-and-limits">EX 13</Resource>
    <Resource type="exercise" href="/PM1C/exercises/14-limits">EX 14</Resource>
  </ChapterInfo>
  <ChapterInfo title="Dérivées" query={{
    "courses": { "some": { "code": "calculus" } },
    "page": {
       "NOT": { title: { contains: "limite" } },
    }
  }}>
    <Resource type="theory" href="/PM1C/slides/08-differentiation?boardName=A">CT 8A</Resource>
    <Resource type="theory" href="/PM1C/slides/08-differentiation?boardName=B">CT 8B</Resource>
    <Resource type="handout" href="/PM1C/slides/08-differentiation?print=true">CT 8</Resource>
    <Resource type="exercise" href="/PM1C/exercises/15-differentiation">EX 15</Resource>
    <Resource type="exercise" href="/PM1C/exercises/16-differentiation">EX 16</Resource>
  </ChapterInfo>
</div>
~~~
