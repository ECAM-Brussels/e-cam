import json
import panflute as pf
import yaml


def plot(el: pf.Element, doc: pf.Doc):
    del doc
    if isinstance(el, pf.CodeBlock) and "plot" in el.classes:
        plots = yaml.safe_load(el.text)
        props = json.dumps(plots)
        if isinstance(plots, list):
            return pf.RawBlock("<LinkedPlot plots={" + props + "} />")
        else:
            return pf.RawBlock("<Plot {...(" + props + ")} />")


pf.run_filter(plot)
