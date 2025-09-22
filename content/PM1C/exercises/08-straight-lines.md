---
title: Droites
slideshow: true
---

# Préparation {.columns-2}

::: {.exercise title="Exercice B.15"}
Montrez que $A(1, 1)$, $B(7, 4)$, $C(5, 10)$ et $D(-1, 7)$ sont les sommets d'un parallélogramme.
:::

::: {.exercise title="Exercice B.25, B.33"}
Trouvez une équation de la droite satisfaisant les conditions données.

- passant par $(2, 1)$ et $(1, 6)$
- passant par $(1, -6)$ et parallèle à $x + 2y = 6$
:::

::: {.exercise title="Exercice B.56"}
Trouvez les longueurs des médianes d'un triangle
dont les sommets sont $A(1, 0)$, $B(3, 6)$ et $C(8, 2)$.
:::

::: {.exercise title="Exercice B.58"}
Montrez que les droites
$$
3x - 5y + 19 = 0
\quad \text{et} \quad
10x + 6y - 50 = 0
$$
sont perpendiculaires et trouvez leur point d'intersection.
:::

::: {.exercise title="Exercice B.59"}
Trouvez l'équation de la médiatrice du segment joignant $A(1, 4)$ et $B(7, -2)$.
:::

# Exercice B.16 p. A16 {.w-1--2}

::: exercise
Montrez que $A(1, 1)$, $B(11, 3)$, $C(10, 8)$ et $D(0, 6)$ sont les sommets d'un rectangle.
:::

::: text-sm
~~~ python {.run}
from sympy import *
A, B = Matrix([1, 1]), Matrix([11, 3])
C, D = Matrix([10, 8]), Matrix([0, 6])
grad = lambda A, B: (B[1] - A[1]) / (B[0] - A[0])
dist = lambda A, B: sqrt((B[1] - A[1])**2 + (B[0] - A[0])**2)

if dist(A, B) == dist(C, D):
    print("AB et CD sont de même longueur")
if dist(A, D) == dist(C, B):
    print("AD et CB sont de même longueur")
if grad(A, B) == grad(D, C):
    print("AB et CD sont parallèles")
# Continuez
~~~
:::

# Exercice B.34 et B.36 p. A16 {.w-1--2}

::: exercise
Trouvez une équation de la droite satisfaisant les conditions données.

- parallèle à $2x + 3y + 4 = 0$, avec $6$ comme ordonnée à l'origine
- passant par $(\frac 1 2, -\frac 2 3)$, perpendiculaire à la droite $4x - 8y = 1$
:::

::::: text-sm
~~~ python {.run}
from sympy import *
x, y = symbols("x y")
eq = Eq(2*x + 3*y + 4, 0)
m = solve(eq, y)[0].coeff(x)
Eq(y, simplify(m * x + 6))
~~~

~~~ python {.run}
from sympy import *
x, y = symbols("x y")
eq = Eq(4*x - 8*y, 1)
m = solve(eq, y)[0].coeff(x)
Eq(y, simplify(-1/m * (x - Rational(1, 2)) - Rational(2, 3)))
~~~
:::::

# Exercice 60 p. A17 {.w-1--2}

::: exercise
a. Trouvez les équations des côtés d'un triangle
   dont les sommets sont $P(1, 0)$, $Q(3, 4)$ et $R(-1, 6)$.
b. Trouvez les équations des médianes de ce triangle.
   Où se trouve leur intersection?
c. Trouvez l'intersection des hauteurs et des médiatrices
d. En déduire l'équation de la droite d'Euler, qui passe par l'intersection des hauteurs, des médiatrices et des médianes.
:::

::::: text-sm
~~~ python {.run}
from sympy import *
x, y = symbols("x y")
P, Q, R = Matrix([1, 0]), Matrix([3, 4]), Matrix([-1, 6])
def median(segment, vertex):
    midpoint = (segment[0] + segment[1]) / 2
    grad = (vertex[1] - midpoint[1]) / (vertex[0] - midpoint[0])
    return Eq(y, simplify(grad * (x - vertex[0]) + vertex[1]))
median([P, Q], R)
~~~

~~~ python {.run}
# Décommentez la ligne suivante pour l'intersection des médianes
# solve([median([P, Q], R), median([R, P], Q)])
~~~
:::::

# Réponses

<Iframe class="w-full h-full" src="/documents/pm1c-answers.pdf#page=8" />
