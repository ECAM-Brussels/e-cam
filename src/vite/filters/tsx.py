#!/usr/bin/env python

import panflute as pf

def math(el: pf.Element, doc: pf.Doc):
    if type(el) == pf.Math:
        display = str(el.format == "DisplayMath").lower()
        return pf.RawInline("<Math value={String.raw`" + el.text + "`} displayMode={" + display + "} />")

pf.run_filter(math)