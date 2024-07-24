import { type JSXElement } from 'solid-js'

export default function Navbar() {
  return (
    <nav>
      <ul class="flex items-center">
        <NavbarItem class="font-bold" href="/">e-cam</NavbarItem>
        <NavbarItem href="/PM1C">Pont maths</NavbarItem>
      </ul>
    </nav>
  )
}

type NavbarItemProps = {
  class?: string
  href: string
  children: JSXElement
}

function NavbarItem(props: NavbarItemProps) {
  return (
    <li>
      <a class={`block py-2 px-3 text-gray-900 hover:text-blue-700 ${props.class}`} href={props.href}>
        {props.children}
      </a>
    </li>
  )
}
