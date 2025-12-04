import CryptoJS from 'crypto-js'
import dedent from 'dedent-js'
import stringify from 'json-stable-stringify'
import { mergeProps, type Component } from 'solid-js'
import z from 'zod'

export function createComponent<S extends z.ZodTypeAny>(schema: S, fn: Component<z.infer<S>>) {
  return function (originalProps: z.input<S>) {
    const props = mergeProps(schema.parse(originalProps))
    return fn(props)
  }
}

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

export function hashObject(obj: object) {
  return CryptoJS.SHA256(stringify(obj)!).toString()
}

export function round(value: number, decimals = 3) {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export const narrow = <A, B extends A>(accessor: () => A, guard: (v: A) => v is B): B | null => {
  const val = accessor()
  if (guard(val)) {
    return val
  }
  return null
}
