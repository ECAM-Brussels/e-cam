#!/usr/bin/env python

import panflute as pf


def tailwind_classes(el: pf.Element, doc: pf.Doc):
    del doc
    if hasattr(el, "classes") and el.classes:
        el.classes = list(map(lambda c: c.replace("--", "/"), el.classes))


def math(el: pf.Element, doc: pf.Doc):
    del doc
    if type(el) == pf.Math:
        display = str(el.format == "DisplayMath").lower()
        return pf.RawInline(
            "<Math value={String.raw`" + el.text + "`} displayMode={" + display + "} />"
        )


def environments(el: pf.Element, doc: pf.Doc):
    del doc
    classes = [
        "definition",
        "example",
        "proposition",
        "question",
        "remark",
        "solution",
        "warning",
    ]
    if type(el) == pf.Div and el.classes and el.classes[0] in classes:
        classes = " ".join(el.classes[1:]) or ""
        name = el.classes[0]
        el.classes = []
        return [
            pf.RawBlock(
                f'<Environment type="{name}" class="{classes}" title="{el.attributes.get("title", "")}">'
            ),
            el,
            pf.RawBlock("</Environment>"),
        ]


def code(el: pf.Element, doc: pf.Doc):
    del doc
    if type(el) == pf.CodeBlock and el.classes:
        run = "true" if "run" in el.classes else "false"
        return pf.RawBlock(
            "<Code value={String.raw`"
            + el.text
            + '`} lang="'
            + el.classes[0]
            + '" run={'
            + run
            + "} />"
        )


pf.run_filters([tailwind_classes, math, environments, code])
