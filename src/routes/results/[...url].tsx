import { faCheck, faFile, faLink, faUser, faXmark } from '@fortawesome/free-solid-svg-icons'
import { createAsync, useParams } from '@solidjs/router'
import { For } from 'solid-js'
import Fa from '~/components/Fa'
import Page from '~/components/Page'
import Table from '~/components/Table'
import { getAssignmentResults } from '~/lib/exercises/assignment'

export default function () {
  const params = useParams()
  const data = createAsync(() => getAssignmentResults('/' + params.url), { initialValue: [] })
  return (
    <Page title="Résultats">
      <section class="bg-white rounded-xl p-4 py-8 border">
        <p class="text-right mx-8 text-sm">
          <a href={`/${params.url}`}>Voir les questions</a>
        </p>
        <h1 class="font-bold text-3xl">Résultats</h1>
        <Table
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
              header: 'Feedback',
              accessorFn: (row) => row.attempts.filter((a) => a.gain > 0).length,
              cell: (info) => (
                <For each={info.row.original.attempts}>
                  {(attempt) => (
                    <span
                      class="px-1"
                      classList={{
                        'text-green-700': attempt.gain > 0,
                        'text-red-700': attempt.gain < 0,
                      }}
                    >
                      {attempt.gain > 0 && <Fa icon={faCheck} />}
                      {attempt.gain < 0 && <Fa icon={faXmark} />}
                    </span>
                  )}
                </For>
              ),
            },
            {
              header: 'Actions',
              cell: (info) => (
                <>
                  <a href={`/users/${info.row.original.email}`} class="mx-2">
                    <Fa icon={faUser} />
                  </a>
                  <a href={`/${params.url}`} class="mx-2">
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
