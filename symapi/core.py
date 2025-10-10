import json
import re
import strawberry
import sympy
import sympy.core.function
import sympy.parsing.latex
from typing import NewType


def split_coordinates(s):
    s = s.replace("\\left", "").replace("\\right", "")
    parts = []
    level = 0
    current = []
    for char in s:
        if char == "(":
            level += 1
        elif char == ")":
            level -= 1
        elif char in ",;" and level == 0:
            parts.append("".join(current).strip())
            current = []
            continue
        current.append(char)
    parts.append("".join(current).strip())
    return parts


def parse_latex(expr: str):
    expr = re.sub(r"\\sqrt(\d+)", r"\\sqrt{\1}", expr)
    expr = expr.replace("\\exponentialE", "{e}")
    expr = expr.replace("\\imaginaryI", "{i}")
    coordinates = re.search(r"^(?:\\left\s*)?\((.*)\)(?:\s*\\right)?$", expr)
    if coordinates:
        return sympy.Tuple(
            *[parse_latex(e) for e in split_coordinates(coordinates.group(1))]
        )
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
        if str(expr.func) == "i":
            x = sympy.I
        return sympy.Mul(x, *expr.args, evaluate=False)
    if expr.func and expr.args:
        with sympy.evaluate(False):
            args = [remove_funcs(a) for a in expr.args]
            return expr.func(*args)
    return expr


def test(*args, **kwargs):
    return rf"args: {args}; {kwargs}"


def custom_latex_log(expr, printer=None, exp=None):
    del printer
    suffix = "" if exp is None else f"^{{{exp}}}"
    if len(expr.args) > 1 and expr.args[1] != sympy.E:
        return (
            rf"\log{suffix}_{{{sympy.latex(expr.args[1])}}}\left({expr.args[0]}\right)"
        )
    else:
        return rf"\ln{suffix}\left({sympy.latex(expr.args[0])}\right)"


sympy.log._latex = custom_latex_log

Math = strawberry.scalar(
    NewType("Math", sympy.Basic),
    serialize=sympy.latex,
    parse_value=parse_latex,
    description="Mathematical formula",
)


def parse_set(expr):
    authorized = ["Interval", "Union", "Complement", "FiniteSet", "EmptySet"]
    if isinstance(expr, str):
        expr = json.loads(expr)

    def parse_entry(entry: list | str | bool):
        if isinstance(entry, int) or isinstance(entry, bool):
            return entry
        if isinstance(entry, str):
            return parse_latex(entry)
        if isinstance(entry, list) and entry[0] in authorized and len(entry) > 1:
            return getattr(sympy, entry[0])(*map(parse_entry, entry[1:]))
        return entry

    return parse_entry(expr)


MathSet = strawberry.scalar(
    NewType("MathSet", sympy.Basic),
    serialize=sympy.latex,
    parse_value=parse_set,
    description="Mathematical set",
)
