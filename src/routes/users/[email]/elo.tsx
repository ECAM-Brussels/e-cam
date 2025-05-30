import UserTabs from './_tabs'
import { createAsyncStore, type RouteDefinition, useParams } from '@solidjs/router'
import { formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'
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
        <h1 class="font-bold text-3xl">
          {user()?.lastName}, {user()?.firstName}
        </h1>
        <h2 class="text-xl">ELO: {user()?.score}</h2>
        <Show when={attempts()}>
          {(attempts) => (
            <Table
              columns={[
                {
                  header: 'Page',
                  accessorFn: (row) => row.assignment.title,
                  cell: (info) => (
                    <a href={info.row.original.url}>{info.row.original.assignment.title}</a>
                  ),
                },
                {
                  header: 'Date',
                  accessorFn: (row) => row.lastModified,
                  cell: (info) => (
                    <>
                      {formatDistance(info.row.original.lastModified, new Date(), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </>
                  ),
                },
                {
                  header: 'Gain',
                  accessorKey: 'gain',
                  cell: (info) => (
                    <div
                      class="text-center rounded font-bold"
                      classList={{
                        'bg-green-800 text-green-50': info.row.original.gain > 0,
                        'bg-red-800 text-red-50': info.row.original.gain < 0,
                      }}
                    >
                      {info.row.original.gain}
                    </div>
                  ),
                },
              ]}
              data={attempts()}
            />
          )}
        </Show>
      </section>
    </Page>
  )
}
