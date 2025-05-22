import { action, createAsyncStore, useParams } from '@solidjs/router'
import { createSignal, For, Suspense } from 'solid-js'
import AssignmentTable from '~/components/AssignmentTable'
import Graph from '~/components/Graph'
import Page from '~/components/Page'
import { getUserInfo } from '~/lib/user'

const grouping = [
  { label: 'Ne pas grouper', groups: [] },
  { label: 'Grouper par année', groups: ['4MATH5', '5MATH4', '5MATH6', '6MATH4', '6MATH6'] },
  { label: 'Grouper par domaine', groups: ['algebra', 'complex'] },
]

export default function () {
  const params = useParams()
  const user = createAsyncStore(() => getUserInfo(params.email))
  const [groups, setGroups] = createSignal<string[]>([])

  const groupAssignments = action(async (form: FormData) => {
    const i = Number(form.get('groupBy'))
    setGroups(grouping[i].groups)
  }, 'groupAssignments')
  return (
    <Suspense>
      <Page title={`Profil de ${user()?.firstName} ${user()?.lastName}`}>
        <section class="bg-white rounded-xl p-4 py-8 border">
          <h1 class="font-bold text-3xl">
            {user()?.lastName}, {user()?.firstName}
          </h1>
          <AssignmentTable />
          <Graph class="min-h-96 w-full" groups={groups()} />
          <form method="post" action={groupAssignments} class="flex gap-4">
            <For each={grouping}>
              {(group, i) => (
                <button>
                  <label>
                    <input type="radio" name="groupBy" value={i()} /> {group.label}
                  </label>
                </button>
              )}
            </For>
          </form>
        </section>
      </Page>
    </Suspense>
  )
}
