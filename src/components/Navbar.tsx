import { faBars, faCircleXmark, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { createAsync, useLocation } from '@solidjs/router'
import { createSignal, For, Show, type JSXElement } from 'solid-js'
import { Portal } from 'solid-js/web'
import Fa from '~/components/Fa'
import { getUser, logout } from '~/lib/auth/session'
import { getCourses } from '~/lib/course'

export default function Navbar() {
  const [showSidebar, setShowSidebar] = createSignal(false)
  return (
    <NavbarShell>
      <Logo />
      <Links />
      <UserInfo onBurgerClick={() => setShowSidebar(!showSidebar())} />
      <Drawer visible={showSidebar()} onOutsideClick={() => setShowSidebar(false)} />
    </NavbarShell>
  )
}

const Logo = () => (
  <ul class="flex items-center">
    <NavbarItem class="font-bold text-2xl text-slate-600 border-b-0" href="/">
      <span>e</span>
      <span class="mx-px text-gray-400">·</span>cam
    </NavbarItem>
  </ul>
)

const Links = () => (
  <ul class="flex items-center">
    <NavbarItem href="/PM1C" underline>
      Pont maths
    </NavbarItem>
    <NavbarItem href="/IC1T" underline>
      Programmation
    </NavbarItem>
  </ul>
)

function UserInfo(props: { onBurgerClick: () => void }) {
  const user = createAsync(() => getUser())
  return (
    <ul class="flex items-center">
      <Show when={user()} fallback={<NavbarItem href="/auth/login">Se connecter</NavbarItem>}>
        {(user) => (
          <>
            <NavbarItem href={`/users/${user().email}`}>{user().firstName}</NavbarItem>
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
      <button onclick={props.onBurgerClick} class="text-xl px-2 py-1">
        <Fa icon={faBars} />
      </button>
    </ul>
  )
}

type NavbarShellProps = {
  children: JSXElement
}

function NavbarShell(props: NavbarShellProps) {
  return (
    <div class="bg-white border-b border-b-gray-200 mb-6 shadow-md shadow-teal-900/5">
      <nav class="container mx-auto flex items-end justify-between">{props.children}</nav>
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
            'hover:text-blue-800': props.href ? true : false,
            'hover:border-b-4': props.underline,
            'hover:border-blue-800': props.underline,
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

function Drawer(props: { visible?: boolean; onOutsideClick?: () => void }) {
  const courses = createAsync(() => getCourses())
  return (
    <Portal>
      <div
        class="fixed left-0 top-0 z-10 h-screen w-full flex flex-row-reverse"
        classList={{ hidden: !props.visible }}
      >
        <div class="h-full w-96 bg-white shadow-xl opacity-100 transition-transform duration-700">
          <button
            onClick={props.onOutsideClick}
            class="my-4 mx-4 font-xl text-slate-300 hover:text-slate-500"
          >
            <Fa icon={faCircleXmark} />
          </button>
          <h3 class="px-4 mb-4 font-bold text-lg [font-variant:small-caps]">Cours</h3>
          <ul class="text-slate-600 font-semibold">
            <For each={courses()}>
              {(course) => (
                <li>
                  <a class="block py-4 px-8 hover:bg-slate-50" href={course.url} noScroll>
                    {course.title}
                  </a>
                </li>
              )}
            </For>
          </ul>
        </div>
        <div class="bg-black h-screen w-full opacity-20" onClick={props.onOutsideClick} />
      </div>
    </Portal>
  )
}
