---
title: Projet learning.ecam.be
slideshow: true
---

# learning.ecam.be {.grid .grid-cols-2 .gap-8}

::::: column
<Iframe src="/" class="w-full h-4/5 border rounded-xl shadow-lg overflow-hidden" />
:::::

::::: column
Une plateforme d'apprentissage spécialisée pour les cours techniques.

- Intégrée

- Correction symbolique automatique

- Génération d'exercices mathématiques
:::::

# Correction symbolique {.grid .grid-cols-2 .gap-8}

::::: {.border .rounded-xl .shadow-lg .p-10 .h-4--5 .z-20 .not-prose}
<Exercise id="presentation-factorisation" data='{"type": "Factor", "state": {"expr": "x^2-5x+6"}}' />

<Exercise id="presentation-diff" data='{"type": "Differentiate", "state": {"expr": "x^2 \\ln x"}}' />
:::::

::::: column
- L'expression est réellement analysée mathématiquement
:::::

# Génération d'exercices aléatoires {.grid .grid-cols-2 .gap-8}

::::: {.z-20 .not-prose}
<Exercise id="presentation-system" data='{"type": "System", "params": {"variables": ["x", "y", "z"], "L": ["-3", "-2", "-1", "0", "1", "2", "3"], "U": ["-3", "-2", "-1", "1", "2", "3"], "X": ["-3", "-2", "-1", "0", "1", "2", "3"]}}' />
:::::

# Python {.w-1--2}

~~~ python {.run}
from sympy import *
x = Symbol("x")
factor(x**2 - 5*x + 6)
~~~

Accès à un interpréteur Python sans aucune installation.