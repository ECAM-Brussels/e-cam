import random
import strawberry
import sympy
from typing import Optional

from symapi.core import Math


@strawberry.type
class System:

    @strawberry.field
    def generate(
        self,
        variables: list[Math],
        Lentries: list[Math],
        Uentries: list[Math],
        X: list[Math],
        elimination_count: Optional[int],
    ) -> list[Math]:
        n = len(variables)
        L = sympy.zeros(n, n)
        U = sympy.zeros(n, n)
        for i in range(n):
            L[i, i] = 1
            for j in range(n):
                if j < i:
                    if elimination_count is None or elimination_count > 0:
                        L[i, j] = random.choice(Lentries)
                    if elimination_count is not None:
                        elimination_count -= 1
                else:
                    U[i, j] = random.choice(Uentries)
                    U[i, j] = 1 if i == j and U[i, j] == 0 else U[i, j]

        A = L * U
        x = sympy.Matrix([random.choice(X) for _ in range(n)])
        b = A * x
        system = A * sympy.Matrix(variables)
        return [sympy.Eq(system[i], b[i], evaluate=False) for i in range(n)]
    
    @strawberry.field
    def check(equations: list[Math], variables: list[Math], x: list[Math]) -> bool:
        subs = dict(zip(variables, x))
        equations = [eq.subs(subs) for eq in equations]
        return all(equations)
