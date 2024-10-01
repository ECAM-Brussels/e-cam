import re
import strawberry
import sympy
import sympy.core.function
import sympy.parsing.latex
from typing import NewType


def parse_latex(expr: str):
    expr = re.sub(r"\\sqrt(\d+)", r"\\sqrt{\1}", expr)
    coordinates = re.search(r"^(?:\\left\s*)?\(([^\(\)]*,[^\(\)]*)(?:\s*\\right)?\)$", expr)
    if coordinates:
        return sympy.Tuple(*[parse_latex(e) for e in coordinates.group(1).split(",")])
    if "=" in expr:
        return sympy.Eq(*[parse_latex(s) for s in expr.split("=")])
    parsed = sympy.parsing.latex.parse_latex(expr)

    # Perform substitutions without touching the expression
    subs = {
        sympy.Symbol("e"): sympy.E,
        sympy.Symbol("i"): sympy.I,
        sympy.Symbol("pi"): sympy.pi,
    }
    with sympy.evaluate(False):
        for before, after in subs.items():
            parsed = parsed.xreplace({before: after})

    return remove_funcs(parsed) if parsed is not None else None


def remove_funcs(expr: sympy.Basic) -> sympy.Basic:
    if isinstance(expr.func, sympy.core.function.UndefinedFunction):
        x = sympy.Symbol(str(expr.func))
        return sympy.Mul(x, *expr.args, evaluate=False)
    if expr.func and expr.args:
        with sympy.evaluate(False):
            args = [remove_funcs(a) for a in expr.args]
            return expr.func(*args)
    return expr


Math = strawberry.scalar(
    NewType("Math", sympy.Basic),
    serialize=sympy.latex,
    parse_value=parse_latex,
    description="Mathematical formula",
)
