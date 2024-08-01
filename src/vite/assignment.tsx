import { type RouteDefinition } from '@solidjs/router'
import { createStore } from 'solid-js/store'
import ExerciseSequence, { loadAssignment, type Exercise } from '~/components/ExerciseSequence'
import Page from '~/components/Page'
import { getUser } from '~/lib/auth/session'

export const route = {
  load: ({ location }) => {
    loadAssignment(location.pathname)
    getUser()
  },
} satisfies RouteDefinition

export default function () {
  // @ts-ignore
  const [data, setData] = createStore<Exercise[]>($body$)
  return (
    <Page>
      <ExerciseSequence data={data} setter={setData} />
    </Page>
  )
}
