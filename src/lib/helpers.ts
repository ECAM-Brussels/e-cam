import dedent from 'dedent-js'

function indent(code: string, indent: string) {
  return code
    .split('\n')
    .map((line) => indent + line)
    .join('\n')
}

export function wrapCode(code: string): string {
  return (
    dedent`
    import contextlib
    import io

    def main(input_values):
        def input(text):
            return input_values.pop(0)
        output = io.StringIO()
        with contextlib.redirect_stdout(output):` +
    '\n' +
    indent(code, '        ') +
    '\n' +
    '    return output.getvalue().strip()'
  )
}
