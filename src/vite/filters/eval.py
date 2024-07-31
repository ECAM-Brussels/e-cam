#!/usr/bin/env python

import panflute as pf
import re
import sympy
import sympy.vector

namespace = {}


def latex(expr):
    C = sympy.vector.CoordSys3D("")
    x, y, z = sympy.symbols("x y z")
    return sympy.latex(expr.subs({C.x: x, C.y: y, C.z: z}))


def run(
    el: pf.Code | pf.CodeBlock, display: bool = False
) -> pf.Element | list[pf.Element]:
    code = el.text
    code_without_last_line = "\n".join(code.split("\n")[:-1])
    last_line = code.split("\n")[-1]
    try:
        if code_without_last_line:
            exec(code_without_last_line, namespace)
        if "=" in last_line:
            exec(last_line, namespace)
            return []
        result = eval(last_line, namespace)
    except:
        pf.debug(f"Error when running: {code}")
        el.classes = 'border-red-800'
        return el
    if isinstance(result, sympy.Basic):
        format = "DisplayMath" if display else "InlineMath"
        result = pf.Math(latex(result), format=format)
        if display:
            result = pf.Para(result)
        return result
    el.text = str(result)
    return el


def run_code(el: pf.Element, doc: pf.Doc) -> None | pf.Element | list[pf.Element]:
    del doc
    if type(el) == pf.Code and "eval" in el.classes:
        return run(el)
    elif type(el) == pf.CodeBlock and "eval" in el.classes:
        return run(el, True)
    if type(el) == pf.Math or (
        type(el) == pf.RawInline and el.format in ["tex", "latex"]
    ):
        matches = re.findall(r"`([^`]*)`", el.text)
        for expr in matches:
            try:
                output = eval(expr, namespace)
                if isinstance(output, (sympy.Basic, sympy.Matrix)):
                    output = latex(output)
                el.text = el.text.replace(f"`{expr}`", str(output))
            except:
                continue


pf.toJSONFilter(run_code)
