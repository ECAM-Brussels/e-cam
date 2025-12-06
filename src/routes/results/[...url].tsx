import { faCheck, faFile, faQuestion, faUser, faXmark } from '@fortawesome/free-solid-svg-icons'
import { createAsync, type RouteDefinition, useParams, createAsyncStore } from '@solidjs/router'
import { createSignal, For, Show } from 'solid-js'
import Fa from '~/components/Fa'
import LineChart from '~/components/LineChart'
import Page from '~/components/Page'
import Table from '~/components/Table'
import { getUser } from '~/lib/auth/session'
import { getAssignmentEloGraph } from '~/lib/elo'
import { getAssignmentResults } from '~/lib/exercises/assignment'

export const route = {
  preload({ params }) {
    getUser()
    getAssignmentResults('/' + params.url)
    getAssignmentEloGraph('/' + params.url)
  },
} satisfies RouteDefinition

export default function () {
  const params = useParams()
  const [page, setPage] = createSignal(1)
  const data = createAsync(() => getAssignmentResults('/' + params.url), { initialValue: [] })
  const dataset = createAsyncStore(() => getAssignmentEloGraph('/' + params.url))
  return (
    <Page title="Résultats">
      <section class="bg-white rounded-xl p-4 py-8 border">
        <p class="text-right mx-8 text-sm">
          <a href={`/${params.url}`}>Voir les questions</a>
        </p>
        <h1 class="font-bold text-3xl">Résultats</h1>
        <Show when={dataset()}>
          {(dataset) => <LineChart class="p-4 lg:p-12" {...dataset()} />}
        </Show>
        <Table
          search
          page={page()}
          setPage={setPage}
          data={data()}
          columns={[
            {
              header: 'Matricule',
              accessorFn: (row) => row.email.split('@')[0],
            },
            {
              header: 'Nom',
              accessorKey: 'lastName',
            },
            {
              header: 'Prénom',
              accessorKey: 'firstName',
            },
            {
              header: 'ELO',
              accessorKey: 'score',
            },
            {
              header: 'Derniers résultats',
              accessorFn: (row) => row.attempts.filter((a) => a.correct === true).length,
              cell: (info) => (
                <For each={info.row.original.attempts}>
                  {(attempt) => (
                    <span
                      title={`Question ${attempt.position}`}
                      class="px-1"
                      classList={{
                        'text-green-700': attempt.correct === true,
                        'text-red-700': attempt.correct === false,
                      }}
                    >
                      {attempt.correct && <Fa icon={faCheck} />}
                      {attempt.correct === null && <Fa icon={faQuestion} />}
                      {attempt.correct === false && <Fa icon={faXmark} />}
                    </span>
                  )}
                </For>
              ),
            },
            {
              header: 'Réponses correctes (%)',
              accessorFn: (row) => Math.round((row.correct / row.attempted) * 100),
            },
            {
              header: 'Actions',
              cell: (info) => (
                <>
                  <a href={`/users/${info.row.original.email}`} class="mx-2">
                    <Fa icon={faUser} />
                  </a>
                  <a href={`/${params.url}?userEmail=${info.row.original.email}`} class="mx-2">
                    <Fa icon={faFile} />
                  </a>
                </>
              ),
            },
          ]}
        />
      </section>
    </Page>
  )
}
