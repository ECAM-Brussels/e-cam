#!/usr/bin/env python

import panflute as pf


def tailwind_classes(el: pf.Element, doc: pf.Doc):
    del doc
    if hasattr(el, "classes") and el.classes:
        el.classes = list(map(lambda c: c.replace("--", "/"), el.classes))


def math(el: pf.Element, doc: pf.Doc):
    if type(el) == pf.Math:
        display = str(el.format == "DisplayMath").lower()
        return pf.RawInline(
            "<Math value={String.raw`" + el.text + "`} displayMode={" + display + "} />"
        )


def environments(el: pf.Element, doc: pf.Doc):
    classes = ["definition"]
    if type(el) == pf.Div and el.classes and el.classes[0] in classes:
        return [
            pf.RawBlock(f'<Environment type="{el.classes[0]}">'),
            el,
            pf.RawBlock("</Environment>"),
        ]


pf.run_filters([tailwind_classes, math, environments])
