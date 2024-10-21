import re
import strawberry
import sympy
import sympy.core.function
import sympy.parsing.latex
import sympy.parsing.sympy_parser
from sympy.printing.latex import LatexPrinter
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

def custom_latex_log(expr, printer=None):
    if len(expr.args) > 1 and expr.args[1] != sympy.E:
        return r"\log_{{{}}}\left({}\right)".format(sympy.latex(expr.args[1]), sympy.latex(expr.args[0]))
    else:
        return r"\ln\left({}\right)".format(sympy.latex(expr.args[0]))

sympy.log._latex = custom_latex_log

Math = strawberry.scalar(
    NewType("Math", sympy.Basic),
    serialize=sympy.latex,
    parse_value=parse_latex,
    description="Mathematical formula",
)
