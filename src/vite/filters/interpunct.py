#!/usr/bin/env python

import panflute as pf

def interpunct(el: pf.Element, doc: pf.Doc):
    if isinstance(el, pf.Str):
        el.text = el.text[:-1].replace('.', '·') + el.text[-1]

pf.run_filter(interpunct)