import { useMatch } from '@solidjs/router'
import { For, type JSXElement } from 'solid-js'

export default function Tabs(props: { links: { href: string; children: JSXElement }[] }) {
  return (
    <ul class="flex border-collapse pl-8">
      <For each={props.links}>
        {(link) => {
          const match = useMatch(() => link.href)
          return (
            <li
              class="border border-l-0 border-b-0 first:border-l rounded-t-xl px-8 py-2"
              classList={{
                'bg-white font-semibold': Boolean(match()),
                'text-gray-500': !Boolean(match()),
              }}
            >
              <a href={link.href}>{link.children}</a>
            </li>
          )
        }}
      </For>
    </ul>
  )
}
