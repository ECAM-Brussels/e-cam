import dataclasses
import functools
import strawberry
import sympy
from typing import Literal, Optional

from symapi.core import Math
from symapi.expression import Expression


@dataclasses.dataclass
class Info:
    type: Literal["ellipse", "hyperbola", "parabola"]
    direction: Literal["horizontal", "vertical"]
    x0: Math
    y0: Math
    a: Optional[Math] = None
    b: Optional[Math] = None
    c: Optional[Math] = None
    p: Optional[Math] = None


@strawberry.type
class ConicSection:
    equation: Math

    @strawberry.field
    def direction(self) -> str:
        return self.info.direction

    @strawberry.field
    def type(self) -> str:
        return self.info.type

    @strawberry.field
    def x0(self) -> "Expression":
        return Expression(expr=self.info.x0)

    @strawberry.field
    def y0(self) -> "Expression":
        return Expression(expr=self.info.y0)

    @strawberry.field
    def center(self) -> "Expression":
        return Expression(expr=sympy.Tuple(self.info.x0, self.info.y0))

    @strawberry.field
    def foci(self) -> "Expression":
        if self.info.type == "parabola":
            if self.info.direction == 'horizontal':
                return Expression(expr=sympy.FiniteSet((self.info.x0 + self.info.p, self.info.y0)))
            else:
                return Expression(expr=sympy.FiniteSet((self.info.x0, self.info.y0 + self.info.p)))
        if self.info.direction == "horizontal":
            return Expression(
                expr=sympy.FiniteSet(
                    (self.info.x0 - self.info.c, self.info.y0),
                    (self.info.x0 + self.info.c, self.info.y0),
                )
            )
        else:
            return Expression(
                expr=sympy.FiniteSet(
                    (self.info.x0, self.info.y0 - self.info.c),
                    (self.info.x0, self.info.y0 + self.info.c),
                )
            )

    @strawberry.field
    def vertices(self) -> "Expression":
        if self.info.type in ["ellipse", "hyperbola"]:
            if self.info.direction == "horizontal":
                return Expression(
                    expr=sympy.FiniteSet(
                        (self.info.x0 - self.info.a, self.info.y0),
                        (self.info.x0 + self.info.a, self.info.y0),
                    )
                )
            else:
                return Expression(
                    expr=sympy.FiniteSet(
                        (self.info.x0, self.info.y0 - self.info.b),
                        (self.info.x0, self.info.y0 + self.info.b),
                    )
                )
        return Expression(expr=sympy.S.EmptySet)

    @functools.cached_property
    def info(self) -> Info:
        equation = self.equation
        if type(equation) == sympy.Eq:
            equation = equation.lhs - equation.rhs

        a, b = sympy.symbols("a b", positive=True)
        x, y, x0, y0, c, p = sympy.symbols("x y x0 y0 c p")

        def coeff(eq):
            eq = sympy.expand(eq * c)
            sols = sympy.solve(
                [
                    (equation - eq).coeff(x**2),
                    (equation - eq).coeff(x),
                    (equation - eq).coeff(y**2),
                    (equation - eq).coeff(y),
                    (equation - eq).subs({x: 0, y: 0}),
                ]
            )
            if not sols:
                return False
            return sols[0]

        # Parabola
        data = coeff((x - x0) ** 2 - 4 * p * (y - y0))
        if data:
            return Info(
                type="parabola",
                direction="vertical",
                p=data[p],
                x0=data[x0],
                y0=data[y0],
            )
        data = coeff((y - y0) ** 2 - 4 * p * (x - x0))
        if data:
            return Info(
                type="parabola",
                direction="horizontal",
                p=data[p],
                x0=data[x0],
                y0=data[y0],
            )

        # Ellipse
        data = coeff((x - x0) ** 2 / a**2 + (y - y0) ** 2 / b**2 - 1)
        if data:
            return Info(
                type="ellipse",
                direction="horizontal" if data[a] >= data[b] else "vertical",
                a=data[a],
                b=data[b],
                c=sympy.sqrt(sympy.Abs(data[a] ** 2 - data[b] ** 2)),
                x0=data[x0],
                y0=data[y0],
            )

        # Hyperbola
        data = coeff((x - x0) ** 2 / a**2 - (y - y0) ** 2 / b**2 - 1)
        if data:
            return Info(
                type="hyperbola",
                direction="horizontal",
                a=data[a],
                b=data[b],
                c=sympy.sqrt(data[a] ** 2 + data[b] ** 2),
                x0=data[x0],
                y0=data[y0],
            )
        data = coeff(-((x - x0) ** 2) / a**2 + (y - y0) ** 2 / b**2 - 1)
        if data:
            return Info(
                type="hyperbola",
                direction="vertical",
                a=data[a],
                b=data[b],
                c=sympy.sqrt(data[a] ** 2 + data[b] ** 2),
                x0=data[x0],
                y0=data[y0],
            )

        raise ValueError("Unknown equation")
