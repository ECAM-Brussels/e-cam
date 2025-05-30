#!/usr/bin/env python

import json
import panflute as pf
import re


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


def environments(el: pf.Element, doc: pf.Doc) -> None | list[pf.Element] | pf.Element:
    del doc
    classes = [
        "definition",
        "example",
        "exercise",
        "hint",
        "info",
        "instruction",
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
    if type(el) == pf.Code:
        el.text = re.sub(r"(\{|\})", r'{"\1"}', el.text)
    if type(el) == pf.CodeBlock and el.classes:
        run = "true" if "run" in el.classes else "false"
        attrs = el.attributes
        attrs["class"] = " ".join(el.classes)
        props = json.dumps(attrs)
        props = f"{{...{props}}}" if el.attributes else ""
        return pf.RawBlock(
            "<Code "
            + props
            + " value={String.raw`"
            + el.text
            + '`} lang="'
            + el.classes[0]
            + '" run={'
            + run
            + "} />"
        )


pf.run_filters([tailwind_classes, math, environments, code])
