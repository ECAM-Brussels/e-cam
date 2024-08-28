import { useLocation } from '@solidjs/router'
import { createResource, For, Show } from 'solid-js'

const modules = import.meta.glob('~/routes/**/*.json')

type BreadcrumbsProps = {
  class?: string
}

export default function Breadcrumbs(props: BreadcrumbsProps) {
  const location = useLocation()
  const parts = () => location.pathname.split('/').filter((path) => path) || ['']
  const [links] = createResource(parts, async (parts) => {
    return await Promise.all(
      parts.map(async (_, i) => {
        const path = '/' + parts.slice(0, i + 1).join('/')
        const key = [path, path + 'index', path + '/index', '/[...404]']
          .map((s) => `/src/routes/(generated)${s}.tsx.json`)
          .filter((p) => Object.keys(modules).includes(p))[0]
        if (key) {
          const meta = (await modules[key]()) as { title?: string }
          return { ...meta, path }
        } else {
          return null
        }
      }),
    )
  })
  return (
    <div class={props.class}>
      <nav class="container mx-auto my-4 text-slate-500">
        <ol class="inline-flex">
          <li>
            <a href="/" class="hover:text-blue-600">
              e·cam
            </a>
          </li>
          <For each={links()}>
            {(link) => (
              <Show when={link !== null && link}>
                {(link) => (
                  <li class="flex items-center">
                    <svg
                      class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                    <Show when={link().path !== location.pathname && link().path + '/' !== location.pathname} fallback={link().title}>
                      <a href={link().path} class="hover:text-blue-600">
                        {link().title}
                      </a>
                    </Show>
                  </li>
                )}
              </Show>
            )}
          </For>
        </ol>
      </nav>
    </div>
  )
}
