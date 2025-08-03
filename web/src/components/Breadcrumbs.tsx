import { createAsyncStore, query, useLocation } from '@solidjs/router'
import { For } from 'solid-js'
import { prisma } from '~/lib/db'

type BreadcrumbsProps = {
  class?: string
}

const getBreadCrumbs = query(async (url: string) => {
  'use server'
  let where: Parameters<typeof prisma.page.updateMany>[0]['where'] = { OR: [] }
  while (url) {
    where.OR!.push({ url })
    url = url.split('/').slice(0, -1).join('/')
  }
  return await prisma.page.findMany({ where })
}, 'getBreadCrumbs')

export default function Breadcrumbs(props: BreadcrumbsProps) {
  const location = useLocation()
  const crumbs = createAsyncStore(() => getBreadCrumbs(location.pathname))
  return (
    <nav class={props.class ?? 'container mx-auto my-4 text-slate-500'}>
      <ol class="inline-flex">
        <li>
          <a href="/" class="hover:text-blue-600">
            e·cam
          </a>
        </li>
        <For each={crumbs()}>
          {(crumb) => (
            <li class="flex items-center">
              <Separator />
              <a href={crumb.url}>{crumb.title}</a>
            </li>
          )}
        </For>
      </ol>
    </nav>
  )
}

const Separator = () => (
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
)
