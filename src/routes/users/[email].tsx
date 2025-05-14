import { createAsyncStore, useParams } from '@solidjs/router'
import { Suspense } from 'solid-js'
import AssignmentTable from '~/components/AssignmentTable'
import Graph from '~/components/Graph'
import Page from '~/components/Page'
import { getUserInfo } from '~/lib/user'

export default function () {
  const params = useParams()
  const user = createAsyncStore(() => getUserInfo(params.email))
  return (
    <Suspense>
      <Page title={`Profil de ${user()?.firstName} ${user()?.lastName}`}>
        <section class="bg-white rounded-xl p-4 py-8 border">
          <h1 class="font-bold text-3xl">
            {user()?.lastName}, {user()?.firstName}
          </h1>
          <AssignmentTable />
          <Graph class="min-h-96 w-full" />
        </section>
      </Page>
    </Suspense>
  )
}
