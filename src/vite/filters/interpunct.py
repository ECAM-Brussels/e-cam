#!/usr/bin/env python3

import panflute as pf


def interpunct(el: pf.Element, doc: pf.Doc):
    del doc
    if isinstance(el, pf.Str):
        el.text = el.text[:-1].replace(".", "·") + el.text[-1]


pf.run_filter(interpunct)
