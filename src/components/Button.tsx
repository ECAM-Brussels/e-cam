import { JSX, mergeProps } from 'solid-js'

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'white' | 'green'
  variant?: 'outlined'
}

export default function Button(rawProps: ButtonProps) {
  const props = mergeProps({ variant: 'outlined', color: 'white' }, rawProps)
  return (
    <button
      classList={{
        'disabled:opacity-50 disabled:cursor-not-allowed': true,
        'rounded-lg py-2 px-4 shadow font-bold': true,
        border: props.variant === 'outlined',
        'bg-white hover:bg-gray-100': props.color === 'white',
        'bg-green-800 hover:bg-green-900 text-green-50': props.color === 'green',
      }}
      {...props}
    >
      {props.children}
    </button>
  )
}
