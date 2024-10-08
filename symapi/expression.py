import strawberry
import sympy
from typing import Optional

from symapi.core import Math


@strawberry.type
class Expression:
    expr: Math = strawberry.field(description="Current mathematical expression")

    @strawberry.field
    def abs(self) -> "Expression":
        return Expression(expr=sympy.Abs(self.expr))

    @strawberry.field
    def arg(self) -> "Expression":
        a, b = self.expr.as_real_imag()
        if a == 0:
            sign = 1 if b >= 0 else -1
            return Expression(expr=sign * sympy.pi / 2)
        theta = sympy.atan(b / a)
        if a < 0 and b > 0:
            theta += sympy.pi
        elif a < 0 and b < 0:
            theta -= sympy.pi
        return Expression(expr=theta)

    @strawberry.field
    def complete_square(self, x: Optional[Math] = sympy.Symbol("x")) -> "Expression":
        a, alpha, beta = sympy.symbols("a alpha beta")
        answer = a * (x - alpha) ** 2 + beta
        eq = sympy.expand(answer - self.expr)
        system = [eq.coeff(x, 2), eq.coeff(x, 1), eq.subs({x: 0})]
        subs = sympy.solve(system)[0]
        return Expression(expr=answer.subs(subs))

    @strawberry.field
    def count(self, expr: Math) -> int:
        return self.expr.count(expr)

    @strawberry.field
    def diff(self, x: Math = sympy.Symbol("x"), n: int = 1) -> "Expression":
        return Expression(expr=sympy.diff(self.expr, x, n))

    @strawberry.field(description="Expand")
    def expand(self) -> "Expression":
        return Expression(expr=sympy.expand(self.expr))

    @strawberry.field
    def expand_complex(self) -> "Expression":
        return Expression(expr=sympy.expand_complex(self.expr))

    @strawberry.field(description="Numerical evaluation")
    def evalf(self, precision: int = 15) -> "Expression":
        return Expression(expr=sympy.N(self.expr, precision))

    @strawberry.field(description="Factor")
    def factor(self) -> "Expression":
        return Expression(expr=sympy.factor(self.expr))

    @strawberry.field
    def is_approximately_equal(self, expr: Math, error: float) -> bool:
        return bool(sympy.N(sympy.Abs(self.expr - expr)) <= error)

    @strawberry.field(description="Perform equality check")
    def is_equal(self, expr: Math) -> bool:
        if isinstance(self.expr, sympy.Eq):
            if not isinstance(expr, sympy.Eq):
                return False
            quotient = sympy.simplify(
                (self.expr.lhs - self.expr.rhs) / (expr.lhs - expr.rhs)
            )
            return len(quotient.free_symbols) == 0
        if isinstance(self.expr, sympy.Tuple):
            if not isinstance(expr, sympy.Tuple) or len(self.expr) != len(expr):
                return False
            return all(
                [
                    sympy.simplify(sympy.expand_complex(expr[i] - self.expr[i])) == 0
                    for i in range(len(expr.args))
                ]
            )
        result = sympy.expand_complex(expr - self.expr)
        return sympy.simplify(result) == 0

    @strawberry.field(description="Check if it's a number")
    def is_number(self) -> bool:
        return self.expr.is_number and not self.expr.has(sympy.Function)

    @strawberry.field(description="Check if a complex number is in polar form")
    def is_polar(self) -> bool:
        if self.expr.is_real:
            return True
        if self.expr.func != sympy.Mul or len(self.expr.args) != 2:
            return False
        r, u = self.expr.args
        if r != sympy.Abs(self.expr) or sympy.Abs(u) != 1:
            return False
        return True

    @strawberry.field
    def is_set_equal(self, items: list[Math]) -> bool:
        def sanitize(expr):
            if isinstance(expr, sympy.Tuple):
                return sympy.Tuple(*[sanitize(a) for a in expr.args])
            return sympy.expand_complex(sympy.simplify(expr))

        items = [sanitize(i) for i in items]
        return (
            sympy.SymmetricDifference(
                sympy.simplify(self.expr), sympy.simplify(set(items))
            )
            == sympy.S.EmptySet
        )

    @strawberry.field(description="Check if fully factored")
    def is_factored(self) -> bool:
        expr = self.expr
        if expr.func != sympy.Mul:
            expr = sympy.Mul(1, expr, evaluate=False)

        # Flatten the tree to avoid inner multiplications
        factors = []
        for term in expr.args:
            if term.func == sympy.Mul:
                factors += term.args
            else:
                factors.append(term)

        for term in factors:
            if sympy.factor(term).func == sympy.Mul:
                return False
        return True

    @strawberry.field(description="Check if numeric")
    def is_numeric(self) -> bool:
        return isinstance(self.expr, (sympy.Float, sympy.Integer))

    @strawberry.field
    def limit(self, x0: Math, x: Optional[Math] = sympy.Symbol("x")) -> "Expression":
        return Expression(expr=sympy.limit(self.expr, x, x0))

    @strawberry.field
    def list(self) -> list["Expression"]:
        return [Expression(expr=item) for item in list(self.expr)]

    @strawberry.field
    def simplify(self) -> "Expression":
        return Expression(expr=sympy.simplify(self.expr))

    @strawberry.field
    def solveset(
        self,
        a: Optional[Math] = None,
        b: Optional[Math] = None,
        complex: Optional[bool] = None,
        x: Optional[Math] = sympy.Symbol("x"),
    ) -> "Expression":
        if complex:
            solset = sympy.solveset(self.expr, x, sympy.S.Complexes)
        else:
            solset = sympy.solveset(self.expr, x, sympy.S.Reals)
        if a is not None and b is not None:
            solset = solset.intersect(sympy.Interval(a, b))
        return Expression(expr=solset)

    @strawberry.field
    def tangent(
        self,
        x0: Math,
        x: Optional[Math] = sympy.Symbol("x"),
        y: Optional[Math] = sympy.Symbol("y"),
        normal: Optional[bool] = False,
    ) -> "Expression":
        m = sympy.diff(self.expr, x).subs({x: x0})
        if normal:
            m = -1 / m
        return Expression(expr=sympy.Eq(y, m * (x - x0) + self.expr.subs({x: x0})))
