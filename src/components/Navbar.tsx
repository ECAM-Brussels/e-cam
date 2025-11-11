import { faBars, faCircleXmark, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { createAsync, useLocation } from '@solidjs/router'
import { For, Show, type JSXElement } from 'solid-js'
import { Portal } from 'solid-js/web'
import { z } from 'zod'
import Fa from '~/components/Fa'
import { getUser, logout } from '~/lib/auth/session'
import { getCourses } from '~/lib/course'
import { createSearchParam } from '~/lib/params'

export default function Navbar() {
  const [showSidebar, setShowSidebar] = createSearchParam(
    'sidebar',
    z.coerce.boolean().default(false),
  )
  return (
    <NavbarShell>
      <Logo />
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
      <Show when={import.meta.env.DEV}>
        <span class="font-thin text-lg text-green-700"> (dev)</span>
      </Show>
    </NavbarItem>
  </ul>
)

function UserInfo(props: { onBurgerClick: () => void }) {
  const user = createAsync(() => getUser())
  const location = useLocation()
  return (
    <ul class="flex items-center">
      <Show when={user()} fallback={<NavbarItem href="/auth/login">Se connecter</NavbarItem>}>
        {(user) => (
          <div class="items-center hidden md:flex">
            <NavbarItem href={`/users/${user().email}`}>{user().firstName}</NavbarItem>
            <NavbarItem>
              <form action={logout} method="post">
                <input type="hidden" name="currentUrl" value={location.pathname} />
                <button type="submit">
                  <Fa icon={faRightFromBracket} /> Se déconnecter
                </button>
              </form>
            </NavbarItem>
          </div>
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
  const user = createAsync(() => getUser())
  const courses = createAsync(() => getCourses({ where: { url: { not: '' } } }))
  const location = useLocation()
  return (
    <Portal>
      <div
        class="fixed left-0 top-0 z-40 h-screen w-full flex flex-row-reverse"
        classList={{ hidden: !props.visible }}
      >
        <div class="h-full w-96 bg-white shadow-xl opacity-100 transition-transform duration-700">
          <button
            onClick={props.onOutsideClick}
            class="my-4 mx-4 font-xl text-slate-300 hover:text-slate-500"
          >
            <Fa icon={faCircleXmark} />
          </button>
          <DrawerLink href="/">Accueil</DrawerLink>
          <Show when={user()}>
            <DrawerLink href={`/users/${user()?.email}`}>Profil</DrawerLink>
          </Show>
          <h3 class="px-4 py-4 font-bold text-lg">Cours</h3>
          <ul class="px-4">
            <For each={courses()}>
              {(course) => (
                <li>
                  <DrawerLink href={course.url ?? '#'}>{course.title}</DrawerLink>
                </li>
              )}
            </For>
          </ul>
          <Show when={user()}>
            <form
              class="hover:bg-slate-50 py-4 px-4 font-semibold text-slate-600"
              action={logout}
              method="post"
            >
              <input type="hidden" name="currentUrl" value={location.pathname} />
              <button>Se déconnecter</button>
            </form>
          </Show>
        </div>
        <div class="bg-black h-screen w-full opacity-50" onClick={props.onOutsideClick} />
      </div>
    </Portal>
  )
}

function DrawerLink(props: { href: string; children: JSXElement }) {
  return (
    <a
      class="text-slate-600 font-semibold block py-4 px-4 hover:bg-slate-50"
      href={props.href}
      noScroll
    >
      {props.children}
    </a>
  )
}
