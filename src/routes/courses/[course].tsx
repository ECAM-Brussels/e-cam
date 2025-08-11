import { createAsyncStore, type RouteDefinition, useParams } from '@solidjs/router'
import Graph from '~/components/Graph'
import Page from '~/components/Page'
import { getUser } from '~/lib/auth/session'
import { getCourse } from '~/lib/course'

export const route = {
  preload({ params }) {
    getUser()
    getCourse(params.course)
  },
} satisfies RouteDefinition

export default function Course() {
  const params = useParams()
  const course = createAsyncStore(() => getCourse(params.course))
  return (
    <Page title={course()?.title ?? ''}>
      <h1 class="text-3xl mb-4">{course()?.title}</h1>
      <Graph
        class="bg-white border rounded-xl w-full h-[800px]"
        query={{ courses: { some: { code: params.course } } }}
      />
    </Page>
  )
}
