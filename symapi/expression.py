import strawberry
import sympy

from symapi.core import Math


@strawberry.type
class Expression:
    expr: Math = strawberry.field(description="Current mathematical expression")

    @strawberry.field
    def count(self, expr: Math) -> int:
        return self.expr.count(expr)

    @strawberry.field(description="Expand")
    def expand(self) -> "Expression":
        return Expression(expr=sympy.expand(self.expr))

    @strawberry.field(description="Perform equality check")
    def is_equal(self, expr: Math) -> bool:
        result = sympy.Add(expr, sympy.Mul(-1, self.expr))
        return sympy.simplify(result) == 0

    @strawberry.field
    def is_set_equal(self, items: list[Math]) -> bool:
        return self.expr == set(items)

    @strawberry.field(description="Check if fully factored")
    def is_factored(self) -> bool:
        expr = self.expr
        if expr.func != sympy.Mul:
            expr = sympy.Mul(1, expr, evaluate=False)
        for term in expr.args:
            if sympy.factor(term).func == sympy.Mul:
                return False
        return True

    @strawberry.field
    def solveset(self) -> "Expression":
        return Expression(expr=sympy.solveset(self.expr))
