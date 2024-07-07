import strawberry
import sympy

from symapi.core import Math


@strawberry.type
class Expression:
    expr: Math = strawberry.field(description="Current mathematical expression")

    @strawberry.field(description="Expand")
    def expand(self) -> "Expression":
        return Expression(expr=sympy.expand(self.expr))

    @strawberry.field(description="Perform equality check")
    def is_equal(self, expr: Math) -> bool:
        result = sympy.Add(expr, sympy.Mul(-1, self.expr))
        return sympy.simplify(result) == 0

    @strawberry.field(description="Check if fully factored")
    def is_factored(self) -> bool:
        expr = self.expr
        if expr.func != sympy.Mul:
            expr = sympy.Mul(1, expr, evaluate=False)
        for term in expr.args:
            if sympy.factor(term).func == sympy.Mul:
                return False
        return True
