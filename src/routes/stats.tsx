import { faUser } from '@fortawesome/free-solid-svg-icons'
import { createAsync, type RouteDefinition } from '@solidjs/router'
import Fa from '~/components/Fa'
import Page from '~/components/Page'
import Table from '~/components/Table'
import { getUser } from '~/lib/auth/session'
import { getStats } from '~/lib/stats'

export const route = {
  preload() {
    getUser()
    getStats()
  },
} satisfies RouteDefinition

export default function Statistics() {
  const stats = createAsync(() => getStats())
  return (
    <Page title="Statistiques">
      <h1 class="text-4xl font-bold mb-8">Statistiques</h1>
      <main class="bg-white rounded-xl border p-8">
        <h2 class="text-2xl font-bold my-4">Statistiques générales</h2>
        <ul class="list-disc px-8">
          <li>{stats()?.userCount ?? 0} utilisateurs</li>
          <li>{stats()?.attempts.correct} exercices corrects</li>
          <li>{stats()?.attempts.total} exercices tentés</li>
        </ul>
        <section class="lg:grid lg:grid-cols-2">
          <div>
            <h2 class="text-2xl font-bold my-4">Meilleurs scores ELO</h2>
            <p>ELO moyen: {stats()?.averages.userScore}</p>
            <Table
              data={stats()?.users ?? []}
              columns={[
                {
                  header: 'Matricule',
                  accessorFn: (row) => row.email.split('@')[0],
                },
                {
                  header: 'Nom',
                  accessorFn: (row) => `${row.lastName} ${row.firstName}`,
                },
                {
                  header: 'ELO',
                  accessorKey: 'score',
                },
                {
                  header: 'Actions',
                  cell: (info) => (
                    <a href={`/users/${info.row.original.email}`} class="mx-2">
                      <Fa icon={faUser} />
                    </a>
                  ),
                },
              ]}
            />
          </div>
          <div>
            <h2 class="text-2xl font-bold my-4">Meilleurs scores ELO</h2>
            <p>ELO moyen: {stats()?.averages.assignmentScore}</p>
            <Table
              data={stats()?.assignments ?? []}
              columns={[
                {
                  header: 'Title',
                  accessorFn: (row) => row.page.title,
                },
                {
                  header: 'ELO',
                  accessorKey: 'score',
                },
                {
                  header: 'Actions',
                  cell: (info) => (
                    <a href={info.row.original.url} class="mx-2">
                      <Fa icon={faUser} />
                    </a>
                  ),
                },
              ]}
            />
          </div>
        </section>
      </main>
    </Page>
  )
}
