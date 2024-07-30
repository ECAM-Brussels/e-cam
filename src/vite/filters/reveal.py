#!/usr/bin/env python

import panflute as pf


def slideshow(el: pf.Element, doc: pf.Doc = None):
    if not doc.get_metadata("slideshow", False):
        return None


header_classes = [
    "block",
    "bg-slate-600",
    "text-white",
    "text-left",
    "text-4xl",
    "mb-6",
    "px-4",
    "py-3",
]

container_classes = [
    "max-w-none",
    "prose",
    "prose-2xl",
    "px-4",
    "text-left",
]


def prepare(doc: pf.Doc):
    if doc.get_metadata("slideshow", False):
        children = []
        for i in reversed(range(len(doc.content))):
            el = doc.content[i]
            if type(el) == pf.Header and el.level == 1:
                doc.content[i] = pf.Header(
                    pf.Span(*el.content, classes=header_classes),
                    level=1,
                    attributes=el.attributes,
                    identifier=el.identifier,
                )
                doc.content.insert(
                    i + 1, pf.Div(*children, classes=container_classes + el.classes)
                )
                children = []
            else:
                children.insert(0, el)
                del doc.content[i]
        return None


pf.run_filter(slideshow, prepare=prepare)
