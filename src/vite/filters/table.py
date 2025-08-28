#!/usr/bin/env python3

import panflute as pf


def table(el: pf.Element, doc: pf.Doc):
    if isinstance(el, pf.Table):
        el.classes += ["container"]
    if isinstance(el, pf.TableRow):
        el.classes += ["even:bg-slate-50"]


pf.run_filter(table)

