import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { createAsync, useAction } from '@solidjs/router'
import { Show, type JSXElement } from 'solid-js'
import Fa from '~/components/Fa'
import { getUser, logout } from '~/lib/auth/session'

export default function Navbar() {
  const user = createAsync(() => getUser())
  return (
    <div class="border-b border-b-gray-200 mb-6 py-1">
      <nav class="container mx-auto flex items-center justify-between">
        <ul class="flex items-center">
          <NavbarItem class="font-bold text-2xl" href="/">
            e-cam
          </NavbarItem>
        </ul>
        <ul class="flex items-center">
          <NavbarItem href="/PM1C">Pont maths</NavbarItem>
        </ul>
        <ul class="flex items-center">
          <Show
            when={user() && user()?.firstName}
            fallback={<NavbarItem href="/auth/login">Se connecter</NavbarItem>}
          >
            {(name) => (
              <>
                <NavbarItem>{name()}</NavbarItem>
                <NavbarItem>
                  <form action={logout} method="post">
                    <button type="submit">Se déconnecter</button>
                  </form>
                </NavbarItem>
              </>
            )}
          </Show>
          <NavbarItem href="https://github.com/ECAM-Brussels/e-cam" class="text-xl text-gray-400">
            <Fa icon={faGithub} />
          </NavbarItem>
        </ul>
      </nav>
    </div>
  )
}

type NavbarItemProps = {
  class?: string
  href?: string
  children: JSXElement
}

function NavbarItem(props: NavbarItemProps) {
  const classes = () =>
    `block py-2 px-3 text-gray-800 ${props.href && 'hover:text-blue-700'} font-semibold text-sm ${props.class}`
  return (
    <li>
      <Show when={props.href} fallback={<span class={classes()}>{props.children}</span>}>
        <a class={classes()} href={props.href}>
          {props.children}
        </a>
      </Show>
    </li>
  )
}
