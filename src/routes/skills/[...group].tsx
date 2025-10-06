import { createAsync, query, useLocation } from '@solidjs/router'
import Graph from '~/components/Graph'
import Page from '~/components/Page'
import { prisma } from '~/lib/db'

const getPageInfo = query(async (url: string) => {
  'use server'
  return await prisma.page.findUnique({ where: { url } })
}, 'getPageInfo')

export default function () {
  const location = useLocation()
  const info = createAsync(() => getPageInfo(location.pathname))
  return (
    <Page title={info()?.title}>
      <h1 class="text-3xl font-bold mb-4">{info()?.title}</h1>
      <Graph
        class="bg-white border rounded-xl h-[900px]"
        query={{ url: { startsWith: location.pathname } }}
      />
    </Page>
  )
}
