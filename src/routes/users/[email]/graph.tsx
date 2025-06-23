import UserTabs from './_tabs'
import { action, json, type RouteDefinition } from '@solidjs/router'
import { For } from 'solid-js'
import { z } from 'zod'
import Graph from '~/components/Graph'
import Page from '~/components/Page'
import { getUser } from '~/lib/auth/session'
import { getAssignmentGraph } from '~/lib/exercises/assignment'
import { createSearchParam } from '~/lib/params'

export const route = {
  preload() {
    getUser()
    getAssignmentGraph(undefined, [])
  },
} satisfies RouteDefinition

const groupsSchema = z
  .union([z.literal('none'), z.literal('year'), z.literal('field')])
  .default('field')

const grouping = {
  none: { label: 'Ne pas grouper', groups: [] },
  year: { label: 'Grouper par année', groups: ['4MATH5', '5MATH4', '5MATH6', '6MATH4', '6MATH6'] },
  field: {
    label: 'Grouper par domaine',
    groups: ['algebra', 'calculus', 'trigonometry', 'geometry'],
  },
}

export default function () {
  const [groupBy, setGroupBy] = createSearchParam('groupBy', groupsSchema)
  const groupAssignments = action(async (form: FormData) => {
    setGroupBy(groupsSchema.parse(form.get('groupBy')))
    return json(null, { revalidate: 'nothing' })
  }, 'groupAssignments')
  return (
    <Page title="Progrès">
      <UserTabs />
      <section class="bg-white rounded-xl p-4 py-8 border">
        <form method="post" action={groupAssignments} class="flex gap-4">
          <For each={Object.entries(grouping)}>
            {([key, group]) => (
              <button>
                <label>
                  <input type="radio" name="groupBy" value={key} checked={groupBy() === key} />{' '}
                  {group.label}
                </label>
              </button>
            )}
          </For>
        </form>
        <Graph class="min-h-96 w-full h-screen" groups={grouping[groupBy()].groups} />
      </section>
    </Page>
  )
}
