import strawberry
import sympy
import sympy.core.function
import sympy.parsing.latex
from typing import NewType


def parse_latex(expr: str):
    if "=" in expr:
        return sympy.Eq(*[parse_latex(s) for s in expr.split("=")])
    parsed = sympy.parsing.latex.parse_latex(expr)
    subs = {
        sympy.Symbol("e"): sympy.E,
        sympy.Symbol("i"): sympy.I,
        sympy.Symbol("pi"): sympy.pi,
    }
    return remove_funcs(parsed.subs(subs)) if parsed else None

def remove_funcs(expr: sympy.Basic) -> sympy.Basic:
    if isinstance(expr.func, sympy.core.function.UndefinedFunction):
        x = sympy.Symbol(str(expr.func))
        print('x:', x, expr.args)
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
