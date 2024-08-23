import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faBridgeWater, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { createAsync, useLocation } from '@solidjs/router'
import { Show, type JSXElement } from 'solid-js'
import Fa from '~/components/Fa'
import { getUser, logout } from '~/lib/auth/session'

export default function Navbar() {
  const user = createAsync(() => getUser())
  return (
    <div class="bg-white border-b border-b-gray-200 mb-6 shadow-md shadow-teal-900/5 sticky top-0 z-10">
      <nav class="container mx-auto flex items-end justify-between">
        <ul class="flex items-center">
          <NavbarItem class="font-bold text-2xl text-slate-600 border-b-0" href="/">
            <span>e</span>
            <span class="text-gray-400">·</span>cam
          </NavbarItem>
        </ul>
        <ul class="flex items-center text-sm">
          <NavbarItem href="/PM1C" underline>
            <Fa icon={faBridgeWater} class="text-2xl" /> Pont maths
          </NavbarItem>
        </ul>
        <ul class="flex items-center text-sm">
          <Show
            when={user() && user()?.firstName}
            fallback={<NavbarItem href="/auth/login">Se connecter</NavbarItem>}
          >
            {(name) => (
              <>
                <NavbarItem>{name()}</NavbarItem>
                <NavbarItem>
                  <form action={logout} method="post">
                    <button type="submit">
                      <Fa icon={faRightFromBracket} /> Se déconnecter
                    </button>
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
  underline?: boolean
  children: JSXElement
}

function NavbarItem(props: NavbarItemProps) {
  const location = useLocation()
  const classes = () => `block p-3 text-gray-800 font-semibold ${props.class}`
  return (
    <li>
      <Show when={props.href} fallback={<span class={classes()}>{props.children}</span>}>
        <a
          class={classes()}
          classList={{
            'hover:text-blue-700': props.href ? true : false,
            'border-b-4': props.underline,
            'border-slate-400': props.underline && location.pathname.startsWith(props.href || ''),
            'border-white': props.underline && !location.pathname.startsWith(props.href || ''),
          }}
          href={props.href}
        >
          {props.children}
        </a>
      </Show>
    </li>
  )
}
