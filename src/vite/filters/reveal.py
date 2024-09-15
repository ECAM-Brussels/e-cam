#!/usr/bin/env python

import panflute as pf


def slideshow(el: pf.Element, doc: pf.Doc = None):
    if not doc.get_metadata("slideshow", False):
        return None
    if type(el) == pf.Header and el.level == 1:
        elements = []
        if el.prev:
            elements.append(pf.RawBlock('</Slide>'))
        classes = list(map(lambda c: c.replace("--", "/"), el.classes))
        el.classes = []
        elements += [
            pf.RawBlock("<Slide class=\"" + " ".join(classes) + "\" title={<>"),
            el,
            pf.RawBlock("</>}>")
        ]
        return elements
    if type(el) == pf.Link:
        if not el.url.startswith('#'):
            el.attributes['target'] = '_blank'
        el.classes += ['relative', 'z-20']


def prepare(doc: pf.Doc):
    if doc.get_metadata("slideshow", False):
        doc.content.append(pf.RawBlock('</Slide>'))


pf.run_filter(slideshow, prepare=prepare)
