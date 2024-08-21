import random
import strawberry
import sympy

from symapi.core import Math


@strawberry.type
class System:

    @strawberry.field
    def generate(
        self,
        variables: list[Math],
        Lentries: list[int],
        Uentries: list[int],
        X: list[int],
    ) -> list[Math]:
        n = len(variables)
        L = sympy.zeros(n, n)
        U = sympy.zeros(n, n)
        for i in range(n):
            L[i, i] = 1
            for j in range(n):
                if j < i:
                    L[i, j] = random.choice(Lentries)
                else:
                    U[i, j] = random.choice(Uentries)

        A = L * U
        x = sympy.Matrix([random.choice(X) for _ in range(n)])
        b = A * x
        system = A * sympy.Matrix(variables)
        return [sympy.Eq(system[i], b[i], evaluate=False) for i in range(n)]
    
    @strawberry.field
    def check(equations: list[Math], unknowns: list[Math], x: list[Math]) -> bool:
        subs = dict(zip(unknowns, x))
        equations = [eq.subs(subs) for eq in equations]
        return all(equations)
