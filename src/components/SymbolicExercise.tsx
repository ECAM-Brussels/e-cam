import Code from './Code'
import SymbolicRepresentation from './SymbolicRepresentation'
import { ComputeEngine } from '@cortex-js/compute-engine'
import dedent from 'dedent-js'
import { createSignal } from 'solid-js'

type Props = {
  attempt?: string
  answer: string
  pre?: string
}

const ce = new ComputeEngine()

export default function SymbolicExercise(props: Props) {
  const [attempt, setAttempt] = createSignal('')
  const json = () => JSON.stringify(ce.parse(attempt()).json)
  const code = () => dedent`
    import sympy
    def parse_tree(expr):
        if isinstance(expr, int):
            return sympy.Integer(expr)
        if isinstance(expr, float):
            return sympy.Rational(str(expr))
        if isinstance(expr, str):
            match expr:
                case "ExponentialE":
                    return sympy.E
                case "ImaginaryUnit":
                    return sympy.I
                case "Pi":
                    return sympy.pi
                case _:
                    return sympy.Symbol(expr)
        if isinstance(expr, list):
            args = [parse_tree(e) for e in expr[1:]]
            match expr[0]:
                # Operations
                case "Abs":
                    return sympy.Abs(*args, evaluate=False)
                case "Add":
                    return sympy.Add(*args, evaluate=False)
                case "Complex":
                    return sympy.Add(args[0], args[1] * sympy.I, evaluate=False)
                case "Divide":
                    if len(args) != 2:
                        raise ValueError("Divide expects exactly 2 arguments")
                    return sympy.Mul(
                        args[0], sympy.Pow(args[1], -1, evaluate=False), evaluate=False
                    )
                case "Derivative":
                    return sympy.diff(*args)
                case "Equal":
                    return cast(sympy.Expr, sympy.Eq(*args, evaluate=False))
                case "Expand":
                    return sympy.expand(args[0])
                case "Factor":
                    return sympy.factor(args[0])
                case "Integrate":
                    return sympy.integrate(*args)
                case "Multiply":
                    return sympy.Mul(*args, evaluate=False)
                case "Negate":
                    return -args[0]
                case "Power":
                    return sympy.Pow(*args, evaluate=False)
                case "Rational":
                    return sympy.Rational(*args)
                case "Simplify":
                    return sympy.simplify(args[0])
                case "Square":
                    return sympy.Pow(args[0], 2)
                case "Sqrt":
                    return sympy.sqrt(*args)
                case "Tuple":
                    return cast(sympy.Expr, sympy.Tuple(*args))
                # Functions
                case "Cos":
                    return sympy.cos(*args, evaluate=False)
                case "Exp":
                    return sympy.exp(*args, evaluate=False)
                case "Log":
                    return sympy.log(*args, evaluate=False)
                case "Sin":
                    return sympy.sin(*args, evaluate=False)
                case "Tan":
                    return sympy.tan(*args, evaluate=False)
        raise ValueError("Not a valid expression")
    #--- start
    from sympy import *
    attempt = parse_tree(${json()})
    ${props.pre}
    diff = ${props.answer} - attempt
    equal = simplify(diff) == 0
    if equal:
      print("Correct!")
    else:
      print("Pas de chance!")
  `
  return (
    <div class="flex items-center justify-around">
      <SymbolicRepresentation onChange={setAttempt} />
      <Code lang="python" value={code()} runImmediately run={attempt() !== ''} />
    </div>
  )
}
