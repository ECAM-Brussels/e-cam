import { JSX, mergeProps } from 'solid-js'

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'white' | 'green' | 'blue'
  variant?: 'outlined'
}

export default function Button(rawProps: ButtonProps) {
  const props = mergeProps({ variant: 'outlined', color: 'white' }, rawProps)
  return (
    <button
      classList={{
        'disabled:opacity-50 disabled:cursor-not-allowed': true,
        'rounded-lg py-2 px-4 shadow font-bold z-50': true,
        border: props.variant === 'outlined',
        'bg-white hover:bg-gray-100': props.color === 'white',
        'bg-green-800 hover:bg-green-900 text-green-50': props.color === 'green',
        'bg-sky-800 hover:bg-sky-900 text-sky-50': props.color === 'blue',
      }}
      {...props}
    >
      {props.children}
    </button>
  )
}
