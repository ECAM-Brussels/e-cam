import json
import re
import strawberry
import sympy
import sympy.core.function
import sympy.parsing.latex
from typing import NewType
import unyt
from sympy.physics.units import (
    convert_to,
    meter,
    kilogram,
    second,
    ampere,
    kelvin,
    mole,
    candela,
    gram,
    centimeter,
    millimeter,
    kilometer,
    hour,
    minute,
    newton,
    pascal,
    joule,
    watt,
    liter,
)
from sympy.parsing.latex import parse_latex as sympy_parse_latex


def split_coordinates(s):
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
    expr = expr.replace("\\ ", " ")
    expr = re.sub(r"\\sqrt(\d+)", r"\\sqrt{\1}", expr)
    expr = expr.replace("\\exponentialE", "{e}")
    expr = expr.replace("\\imaginaryI", "{i}")
    expr = re.sub(r"\^([0-9a-zA-Z])", r"^{\1}", expr)  # 2^3 4 is not 2^34
    coordinates = re.fullmatch(r"(?:\\left\s*)?\((.*)\)(?:\s*\\right)?", expr)
    if coordinates:
        parts = split_coordinates(coordinates.group(1))
        if len(parts) > 1:
            return sympy.Tuple(*[parse_latex(e) for e in parts])
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


BASE_SI = [meter, kilogram, second, ampere, kelvin, mole]


MY_UNITS = {
    "km": kilometer,
    "m": meter,
    "cm": centimeter,
    "mm": 0.001 * meter,
    "g": gram,
    "kg": kilogram,
    "h": hour,
    "min": minute,
    "s": second,
    "ms": 0.001 * second,
    "N": newton,
    "Pa": pascal,
    "J": joule,
    "W": watt,
    "L": liter,
    "tonne": 1000 * kilogram,
    "t": 1000 * kilogram,
    "N": newton,
    "kN": 1000 * newton,
}


def parse_unit(unit_str: str) -> str:
    u_str = str(unit_str).strip()

    if not re.match(r"^[a-zA-Z0-9\s\*\/\^\+\-\.\(\)]+$", u_str):
        return "1"
    return u_str


Unit = strawberry.scalar(
    NewType("Unit", str),
    serialize=lambda v: str(v),
    parse_value=parse_unit,
    description="pour l instant pas besoin ",
)
