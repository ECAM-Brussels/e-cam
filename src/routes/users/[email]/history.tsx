import UserTabs from './_tabs'
import { createAsyncStore, type RouteDefinition, useParams } from '@solidjs/router'
import { formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'
import { JSX, Show, Suspense } from 'solid-js'
import { z } from 'zod'
import { ExerciseUI } from '~/components/Assignment'
import Page from '~/components/Page'
import Table from '~/components/Table'
import { getUser } from '~/lib/auth/session'
import { getUserAttempts } from '~/lib/exercises/attempt'
import { optionsSchema } from '~/lib/exercises/schemas'
import { createSearchParam } from '~/lib/params'
import { getUserInfo } from '~/lib/user'

export const route = {
  preload({ params }) {
    getUser()
    getUserInfo(params.email)
    getUserAttempts(params.email)
  },
} satisfies RouteDefinition

const filters: {
  [key: string]: (attempt: Awaited<ReturnType<typeof getUserAttempts>>[number]) => boolean
} = {
  all: () => true,
  incorrect: (attempt) => attempt.correct === false,
}
const filterNames = z.union([z.literal('incorrect'), z.literal('all')]).default('all')

export default function () {
  const params = useParams()
  const user = createAsyncStore(() => getUserInfo(params.email))
  const attempts = createAsyncStore(() => getUserAttempts(params.email))
  const [page, setPage] = createSearchParam('page', z.coerce.number().default(1))
  const [filter, setFilter] = createSearchParam('filter', filterNames)
  const changeFilter: JSX.ChangeEventHandler<HTMLInputElement, Event> = (event) => {
    setFilter(filterNames.parse(event.target.value))
  }
  return (
    <Page title={`Historique`}>
      <UserTabs />
      <section class="bg-white rounded-xl p-4 py-8 border">
        <h1 class="font-bold text-3xl">
          {user()?.lastName}, {user()?.firstName}
        </h1>
        <h2 class="text-xl">ELO: {user()?.score}</h2>
        <p class="flex gap-4">
          <label>
            <input
              type="radio"
              name="filter"
              value="all"
              onChange={changeFilter}
              checked={filter() === 'all'}
            />{' '}
            Tout montrer
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="incorrect"
              onChange={changeFilter}
              checked={filter() === 'incorrect'}
            />{' '}
            Montrer les erreurs
          </label>
        </p>
        <Show when={attempts()}>
          {(attempts) => (
            <Table
              page={page()}
              setPage={setPage}
              columns={[
                {
                  header: 'Page',
                  accessorFn: (row) => row.assignment.page.title,
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
                    <Show when={info.row.original.gain}>
                      {(gain) => (
                        <div
                          class="text-center rounded font-bold"
                          classList={{
                            'bg-green-800 text-green-50': gain() > 0,
                            'bg-red-800 text-red-50': gain() < 0,
                          }}
                        >
                          {gain() > 0 && '+'}
                          {gain()}
                        </div>
                      )}
                    </Show>
                  ),
                },
              ]}
              data={attempts().filter(filters[filter()])}
              subComponent={(row) => (
                <Show when={row.exercise}>
                  {(exercise) => (
                    <Suspense>
                      <ExerciseUI
                        {...row.exercise}
                        options={optionsSchema.parse(exercise().options)}
                      />
                      <a class="text-sm" href={`${row.url}/${row.position}`}>
                        Plus de détails
                      </a>
                    </Suspense>
                  )}
                </Show>
              )}
            />
          )}
        </Show>
      </section>
    </Page>
  )
}
