import json
import panflute as pf
import yaml

def convert(message: dict):
    msg_type = "in" if "in" in message else "out"
    msg = message[msg_type]
    return {
      "incoming": True if msg_type == "in" else False,
      "text": msg,
    }

def conversation(el: pf.Element, doc: pf.Doc):
    del doc
    if isinstance(el, pf.CodeBlock) and "conversation" in el.classes:
        data = yaml.safe_load(el.text)
        messages = list(map(convert, data))
        return pf.RawBlock(
            '<Conversation recipient="'
            + el.attributes.get("to", "Unknown")
            + '" messages={'
            + json.dumps(messages)
            + "} />"
        )


pf.run_filter(conversation)
