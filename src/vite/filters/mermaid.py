import panflute as pf


def mermaid(el: pf.Element, doc: pf.Doc):
    del doc
    if isinstance(el, pf.CodeBlock) and "mermaid" in el.classes:
        return pf.RawBlock(f'<Mermaid value="{el.text}" class="{' '.join(el.classes)}" />')


pf.run_filter(mermaid)
