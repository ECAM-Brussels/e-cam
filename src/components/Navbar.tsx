import { createAsync } from '@solidjs/router'
import { Show, type JSXElement } from 'solid-js'
import { getUser } from '~/lib/auth/session'

export default function Navbar() {
  const session = createAsync(getUser)
  return (
    <nav>
      <ul class="flex items-center">
        <NavbarItem class="font-bold" href="/">
          e-cam
        </NavbarItem>
        <NavbarItem href="/PM1C">Pont maths</NavbarItem>
        <Show
          when={session() && session()?.name}
          fallback={<NavbarItem href="/login">Login</NavbarItem>}
        >
          {(name) => <li class="py-2 px-3">{name()}</li>}
        </Show>
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
      <a
        class={`block py-2 px-3 text-gray-900 hover:text-blue-700 ${props.class}`}
        href={props.href}
      >
        {props.children}
      </a>
    </li>
  )
}
