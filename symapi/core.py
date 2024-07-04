import strawberry
import sympy
import sympy.parsing.latex
from typing import NewType


def parse_latex(expr: str):
    parsed = sympy.parsing.latex.parse_latex(expr)
    subs = {
        sympy.Symbol("e"): sympy.E,
        sympy.Symbol("i"): sympy.I,
        sympy.Symbol("pi"): sympy.pi,
    }
    return parsed.subs(subs) if parsed else None


Math = strawberry.scalar(
    NewType("Math", sympy.Basic),
    serialize=sympy.latex,
    parse_value=parse_latex,
    description="Mathematical formula",
)
