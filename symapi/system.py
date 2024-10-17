import random
import strawberry
import sympy
from typing import Optional

from symapi.core import Math
from symapi.expression import Expression


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
        zeroRows: int = 0,
        impossible: bool = False,
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
                elif i < n - zeroRows:
                    U[i, j] = random.choice(Uentries)
                    U[i, j] = 1 if i == j and U[i, j] == 0 else U[i, j]

        A = L * U
        if not impossible:
            x = sympy.Matrix([random.choice(X) for _ in range(n)])
            b = A * x
        else:
            b = sympy.Matrix([random.choice(X) for _ in range(n)])
            b[-1] = b[-1] if b[-1] != 0 else 1
            b = L**(-1) * b
        system = A * sympy.Matrix(variables)
        return [sympy.Eq(system[i], b[i], evaluate=False) for i in range(n)]
    
    @strawberry.field
    def check(equations: list[Math], variables: list[Math], x: list[Math]) -> bool:
        subs = dict(zip(variables, x))
        dim = len(variables) - len(sympy.solve(equations, variables))
        symbols = set()
        for var in x:
            symbols = symbols.union(var.free_symbols)
        if dim != len(symbols):
            return False
        equations = [eq.subs(subs) for eq in equations]
        return all(equations)

    @strawberry.field
    def solve(self, equations: list[Math], variables: list[Math]) -> list["Expression"]:
        solution = sympy.solve(equations, variables)
        if not solution:
            return []
        return [Expression(expr=solution[t] if t in solution else t) for t in variables]
