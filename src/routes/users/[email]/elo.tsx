import UserTabs from './_tabs'
import { createAsyncStore, type RouteDefinition, useParams } from '@solidjs/router'
import { Show } from 'solid-js'
import Page from '~/components/Page'
import Table from '~/components/Table'
import { getUser } from '~/lib/auth/session'
import { getUserAttempts } from '~/lib/exercises/attempt'
import { getUserInfo } from '~/lib/user'

export const route = {
  preload({ params }) {
    getUser()
    getUserInfo(params.email)
    getUserAttempts(params.email)
  },
} satisfies RouteDefinition

export default function () {
  const params = useParams()
  const user = createAsyncStore(() => getUserInfo(params.email))
  const attempts = createAsyncStore(() => getUserAttempts(params.email))
  return (
    <Page title={`ELO score`}>
      <UserTabs />
      <section class="bg-white rounded-xl p-4 py-8 border">
        <h1 class="font-bold text-3xl my-8">
          {user()?.lastName}, {user()?.firstName}
        </h1>
        <Show when={attempts()}>
          {(attempts) => (
            <Table
              columns={[
                { header: "Type d'exercice", accessorFn: (row) => row.exercise.type },
                { header: 'Date', accessorFn: (row) => row.lastModified },
                { header: 'Gain', accessorKey: 'gain' },
              ]}
              data={attempts()}
            />
          )}
        </Show>
      </section>
    </Page>
  )
}
