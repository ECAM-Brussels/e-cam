---
title: Projet learning.ecam.be
slideshow: true
---

# learning.ecam.be {.grid .grid-cols-2 .gap-8}

::::: column
<Iframe src="/" class="w-full h-full border rounded-xl shadow-lg overflow-hidden" />
:::::

::::: column
<https://learning.ecam.be>

Une plateforme d'apprentissage spécialisée pour les cours techniques.

- Intégrée

- Correction symbolique automatique

- Correction d'exercices d'informatique

- Génération d'exercices mathématiques
:::::

# Correction symbolique {.grid .grid-cols-2 .gap-8}

::::: {.border .rounded-xl .shadow-lg .p-10 .h-4--5 .z-20 .not-prose}
<Exercise id="presentation-factorisation" data='{"type": "Factor", "state": {"expr": "x^2-5x+6"}}' />

<Exercise id="presentation-diff" data='{"type": "Differentiate", "state": {"expr": "x^2 \\ln x"}}' />
:::::

::::: column
- L'expression est réellement analysée mathématiquement

- L'interface est claire et intuitive pour les étudiants
:::::

# Suivi des résultats {.grid .grid-cols-2 .gap-8}

# Génération d'exercices aléatoires {.grid .grid-cols-2 .gap-8}

::::: {.z-20 .not-prose}
<Exercise id="presentation-system" data='{"type": "System", "params": {"variables": ["x", "y", "z"], "L": ["-3", "-2", "-1", "0", "1", "2", "3"], "U": ["-3", "-2", "-1", "1", "2", "3"], "X": ["-3", "-2", "-1", "0", "1", "2", "3"]}}' />
:::::

::: column
- L'exercice ci-contre a été généré aléatoirement de sorte que:

  - les réponses comportent des chiffres entiers uniquement entre $-3$ et $3$.

  - les étapes intermédiaires ne travaillent que sur des nombres entiers de $-3$ à $-3$.
:::

# Python {.w-1--2}

~~~ python {.run}
from sympy import *
x = Symbol("x")
factor(x**2 - 5*x + 6)
~~~

Accès à un interpréteur Python sans aucune installation.