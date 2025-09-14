from enum import Enum
import strawberry
import sympy
import textwrap
from typing import Optional

from symapi.core import Math, MathSet


@strawberry.enum
class SortOptions(Enum):
    abs = sympy.Abs
    nosort = False


def flatten_mul(expr: sympy.Basic) -> sympy.Basic:
    if expr.func != sympy.Mul:
        return expr
    factors = []
    for term in expr.args:
        if term.func == sympy.Mul:
            factors += term.args
        else:
            factors.append(term)
    return sympy.Mul(*factors, evaluate=False)


@strawberry.type
class Expression:
    expr: Math = strawberry.field(description="Current mathematical expression")

    @strawberry.field(description="Absolute value (or modulus for a complex number)")
    def abs(self) -> "Expression":
        return Expression(expr=sympy.Abs(self.expr))

    @strawberry.field(description="Add `expr` to the current expression")
    def add(self, expr: Math) -> "Expression":
        return Expression(expr=sympy.Add(self.expr, expr))

    @strawberry.field(description="Argument for a complex number")
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
    def args(self) -> list["Expression"]:
        return [Expression(expr=arg) for arg in self.expr.args]

    @strawberry.field(description="Coefficient of `x`^`n`")
    def coeff(self, x: Math = sympy.Symbol("x"), n: int = 1) -> "Expression":
        return Expression(expr=sympy.expand(self.expr).coeff(x, n))

    @strawberry.field(description="Express a quadratic equation as a perfect square")
    def complete_square(self, x: Optional[Math] = sympy.Symbol("x")) -> "Expression":
        a, alpha, beta = sympy.symbols("a alpha beta")
        answer = a * (x - alpha) ** 2 + beta
        eq = sympy.expand(answer - self.expr)
        system = [eq.coeff(x, 2), eq.coeff(x, 1), eq.subs({x: 0})]
        subs = sympy.solve(system)[0]
        return Expression(expr=answer.subs(subs))

    @strawberry.field(description="Count how many times an expression appears")
    def count(self, expr: Math) -> int:
        return self.expr.count(expr)

    @strawberry.field(
        description="Differentiate n times with respect to a given variable"
    )
    def diff(self, x: Math = sympy.Symbol("x"), n: int = 1) -> "Expression":
        expr = self.expr.replace(
            lambda expr: expr.is_Function
            and isinstance(expr, sympy.log)
            and len(expr.args) == 2,
            lambda expr: sympy.log(expr.args[0]) / sympy.log(expr.args[1]),
        )
        return Expression(expr=sympy.diff(expr, x, n))

    @strawberry.field
    def differential_quotient(
        self, x0: Math, x: Math = sympy.Symbol("x")
    ) -> "Expression":
        num = sympy.simplify(self.expr - self.expr.subs({x: x0}))
        den = sympy.simplify(x - x0)
        with sympy.evaluate(False):
            expr = num / den
            return Expression(expr=expr)

    @strawberry.field(description="Expand an expression")
    def expand(self) -> "Expression":
        return Expression(expr=sympy.expand(self.expr))

    @strawberry.field(description="Write a complex number under the a + bi form")
    def expand_complex(self) -> "Expression":
        return Expression(expr=sympy.expand_complex(self.expr))

    @strawberry.field(description="Numerical evaluation")
    def evalf(self, precision: int = 15) -> "Expression":
        return Expression(expr=sympy.N(self.expr, precision))

    @strawberry.field(description="Factor an expression")
    def factor(self) -> "Expression":
        return Expression(expr=sympy.factor(self.expr))

    @strawberry.field
    def func(self) -> str:
        return str(self.expr.func.__name__)

    @strawberry.field
    def im(self) -> "Expression":
        _, b = self.expr.as_real_imag()
        return Expression(expr=b)

    @strawberry.field(description="Get element with a particular index from a list")
    def index(self, i: int) -> "Expression":
        return Expression(expr=list(self.expr)[i])

    @strawberry.field(
        description="Check whether the difference between the current expression and `expr` is sufficiently small"
    )
    def is_approximately_equal(self, expr: Math, error: float) -> bool:
        return bool(sympy.N(sympy.Abs(self.expr - expr)) <= error)

    @strawberry.field(description="Check if a complex number is in standard form")
    def is_complex_rectangular(self, strict: Optional[bool] = False) -> bool:
        if not strict:
            if self.expr.is_real and not self.expr.has(sympy.I):
                return True
            if self.expr.is_imaginary:
                if self.expr == sympy.I:
                    return True
                if (
                    self.expr.func == sympy.Mul
                    and all([x.is_real for x in self.expr.args[:-1]])
                    and self.expr.args[-1] == sympy.I
                ):
                    return True
        if self.expr.func != sympy.Add or len(self.expr.args) != 2:
            return False
        a, b = flatten_mul(self.expr.args[0]), flatten_mul(self.expr.args[1])
        return (
            a.is_real
            and a.has(sympy.I) == False
            and (
                b == sympy.I
                or (
                    b.func == sympy.Mul
                    and all([x.is_real for x in b.args[:-1]])
                    and b.args[-1] == sympy.I
                )
            )
        )

    @strawberry.field(description="Perform equality check")
    def is_equal(
        self, expr: Math, complex: Optional[bool] = False, modulo: Optional[Math] = None
    ) -> bool:
        expand = sympy.expand_complex if complex else sympy.expand
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
                    sympy.simplify(expand(expr[i] - self.expr[i])) == 0
                    for i in range(len(expr.args))
                ]
            )
        result = expand(expr - self.expr)
        if modulo:
            return sympy.simplify(result / modulo).is_integer
        return sympy.simplify(result) == 0

    @strawberry.field(description="Check if a complex number is in exponential form")
    def is_exponential(self) -> bool:
        if not self.is_polar(False):
            return False
        return (
            self.expr.args[1].func == sympy.exp
            and self.expr.args[1].args[0].is_imaginary
        ) or (
            self.expr.args[1].func == sympy.Pow
            and self.expr.args[1].args[0] == sympy.E
            and self.expr.args[1].args[1].is_imaginary
        )

    @strawberry.field(description="Check if a number is nonnegative")
    def is_nonnegative(self) -> bool:
        return self.expr.is_nonnegative

    @strawberry.field(description="Check if it's a number")
    def is_number(self) -> bool:
        return self.expr.is_number and not self.expr.has(sympy.Function)

    @strawberry.field(description="Check if a complex number is in polar form")
    def is_polar(self, strict: Optional[bool] = False) -> bool:
        if self.expr.func != sympy.Mul or len(self.expr.args) != 2:
            return False
        r, u = self.expr.args
        neq = lambda x, y: sympy.simplify(x - y) != 0
        if neq(r, sympy.Abs(self.expr)) or neq(sympy.Abs(u), 1):
            return False
        if strict:
            if u.func != sympy.Add:
                return False
            return all(map(lambda x: x.is_real or x.is_imaginary, u.args))
        return True

    @strawberry.field(description="")
    def is_symmetric_set(self) -> bool:
        x = sympy.Symbol("x")
        opposite = sympy.Lambda(x, -x)
        return self.is_set_equal(sympy.simplify(sympy.ImageSet(opposite, self.expr)))

    @strawberry.field(
        description=textwrap.dedent(
            """
                Check if the current expression (a mathematical set,
                as given by `solveset` for example) is equal to a given set.
            """
        )
    )
    def is_set_equal(self, S: MathSet, complex: Optional[bool] = False) -> bool:
        x = sympy.Symbol("x")

        def simplify(expr: Math):
            expr = sympy.simplify(expr)
            if complex:
                expr = sympy.expand_complex(expr)
            return expr

        sanitize = sympy.Lambda(x, simplify(x))
        return (
            sympy.SymmetricDifference(
                sympy.simplify(self.expr), sympy.simplify(sympy.ImageSet(sanitize, S))
            )
            == sympy.S.EmptySet
        )

    @strawberry.field(description="Check if the current expression is fully expanded")
    def is_expanded(self) -> bool:
        expr = self.expr
        if expr.func != sympy.Add:
            expr = sympy.Add(0, expr, evaluate=False)

        terms = []
        for term in expr.args:
            if term.func == sympy.Add:
                terms += term.args
            else:
                terms.append(term)

        for term in terms:
            if sympy.expand(term).func == sympy.Add:
                return False
        return True

    @strawberry.field(description="Check if the current expression is fully factored")
    def is_factored(self) -> bool:
        expr = self.expr
        if expr.func != sympy.Mul:
            expr = sympy.Mul(1, expr, evaluate=False)
        expr = flatten_mul(expr)

        for term in expr.args:
            if sympy.factor(term).func == sympy.Mul:
                return False
            if term.func != sympy.Pow and sympy.factor(term).func == sympy.Pow:
                return False
        return True

    @strawberry.field(
        description="Check if the current expression is a float or an int"
    )
    def is_numeric(self) -> bool:
        return isinstance(self.expr, (sympy.Float, sympy.Integer))

    @strawberry.field(description="")
    def is_polynomial(self, symbols: list[Math] = []) -> bool:
        return self.expr.is_polynomial(*symbols)

    @strawberry.field(
        description="Evaluate the limit of the current expression at `x` = `x0`"
    )
    def limit(self, x0: Math, x: Optional[Math] = sympy.Symbol("x")) -> "Expression":
        return Expression(expr=sympy.limit(self.expr, x, x0))

    @strawberry.field(
        description="Transform the current expression into a list of expressions."
    )
    def list(
        self, sort: Optional[SortOptions] = SortOptions.nosort
    ) -> list["Expression"]:
        res = list(self.expr)
        if sort != SortOptions.nosort:
            res.sort(key=sort.value)
        return [Expression(expr=item) for item in res]

    @strawberry.field(description="Maximum value of the current expression")
    def maximum(
        self,
        x: Optional[Math] = sympy.Symbol("x"),
        S: Optional[MathSet] = sympy.S.Reals,
    ) -> "Expression":
        return Expression(expr=sympy.maximum(self.expr, x, S))

    @strawberry.field(description="Minimum value of the current expression")
    def minimum(
        self,
        x: Optional[Math] = sympy.Symbol("x"),
        S: Optional[MathSet] = sympy.S.Reals,
    ) -> "Expression":
        return Expression(expr=sympy.minimum(self.expr, x, S))

    @strawberry.field(
        description="Multiply a polynomial so that it could be factored without fractions if all its roots are rational."
    )
    def normalize_roots(self) -> "Expression":
        multiple = 1
        for root in sympy.roots(self.expr, multiple=True):
            multiple = sympy.Mul(multiple, sympy.fraction(root)[1])
        return Expression(expr=sympy.expand(multiple * self.expr))

    @strawberry.field
    def opposite(self) -> "Expression":
        return Expression(expr=sympy.Mul(-1, self.expr))

    @strawberry.field
    def real(self) -> "Expression":
        a, _ = self.expr.as_real_imag()
        return Expression(expr=a)

    @strawberry.field
    def simplify(self) -> "Expression":
        return Expression(expr=sympy.simplify(self.expr))

    @strawberry.field(
        description="Get the solution set of an equation, which can be intersected with [`a`, `b`] if necessary"
    )
    def solveset(
        self,
        S: Optional[MathSet] = None,
        complex: Optional[bool] = None,
        x: Optional[Math] = sympy.Symbol("x"),
    ) -> "Expression":
        if complex:
            solset = sympy.solveset(self.expr, x, sympy.S.Complexes)
        else:
            solset = sympy.solveset(self.expr, x, sympy.S.Reals)
        if S is not None:
            solset = solset.intersect(S)
        return Expression(expr=solset)

    @strawberry.field(description="Subtract `expr` from the current expression")
    def subtract(self, expr: Math) -> "Expression":
        return Expression(expr=sympy.Add(self.expr, sympy.Mul(-1, expr)))

    @strawberry.field(description="Get stationary points of an expression")
    def stationary_points(
        self,
        x: Optional[Math] = sympy.Symbol("x"),
        S: Optional[MathSet] = sympy.S.Reals,
    ) -> "Expression":
        return Expression(expr=sympy.stationary_points(self.expr, x, S))

    @strawberry.field
    def str(self) -> str:
        return str(self.expr)

    @strawberry.field
    def subs(self, expr: Math, val: Math) -> "Expression":
        return Expression(expr=self.expr.subs(expr, val))

    @strawberry.field
    def subs_in(self, expr: Math, var: Math) -> "Expression":
        return Expression(expr=expr.subs(var, self.expr))

    @strawberry.field
    def tangent(
        self,
        x0: Math,
        x: Optional[Math] = sympy.Symbol("x"),
        y: Optional[Math] = sympy.Symbol("y"),
        normal: Optional[bool] = False,
    ) -> "Expression":
        m = sympy.diff(self.expr, x).subs({x: x0})
        if m == 0 and normal:
            return Expression(expr=sympy.Eq(x, x0))
        if normal:
            m = -1 / m
        return Expression(expr=sympy.Eq(y, m * (x - x0) + self.expr.subs({x: x0})))
