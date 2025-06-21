import { createAsyncStore, type RouteDefinition } from '@solidjs/router'
import { For } from 'solid-js'
import Card from '~/components/Card'
import Page from '~/components/Page'
import { getPreferences, getUser, setPreferences } from '~/lib/auth/session'
import { getCourses } from '~/lib/course'

export const route = {
  preload() {
    getUser()
    getPreferences()
  },
} satisfies RouteDefinition

export default function Home() {
  const preferences = createAsyncStore(() => getPreferences())
  const courses = createAsyncStore(() =>
    getCourses({ where: { url: { not: '' }, image: { not: '' } } }),
  )
  return (
    <Page title="Accueil">
      <form action={setPreferences.with({ ecam: false })} method="post">
        <label class="inline-flex gap-4">
          <input
            type="checkbox"
            class="sr-only peer"
            name="ecam"
            checked={preferences()?.ecam}
            onChange={(e) => {
              e.target.closest('form')?.requestSubmit()
            }}
          />{' '}
          <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          Je suis étudiant·e à l'ECAM
        </label>
        <label class="inline-flex items-center cursor-pointer"></label>
      </form>
      <div class="grid lg:grid-cols-2 gap-8 container mx-auto my-8">
        <For each={courses()?.filter((c) => c.ecam === preferences()?.ecam)}>
          {(course) => (
            <Card href={course.url ?? ''} image={course.image ?? ''}>
              <h3>{course.title}</h3>
            </Card>
          )}
        </For>
      </div>
    </Page>
  )
}
