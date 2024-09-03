import json
import panflute as pf
import yaml


def plot(el: pf.Element, doc: pf.Doc = None):
    if isinstance(el, pf.CodeBlock) and "plot" in el.classes:
        props = json.dumps(yaml.safe_load(el.text))
        return pf.RawBlock("<Plot {...(" + props + ")} />")


pf.run_filter(plot)
