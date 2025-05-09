import { createAsyncStore, useParams } from '@solidjs/router'
import { Show } from 'solid-js'
import Graph from '~/components/Graph'
import Page from '~/components/Page'
import { getUserInfo } from '~/lib/user'

export default function () {
  const params = useParams()
  const user = createAsyncStore(() => getUserInfo(params.email))
  return (
    <Show when={user()}>
      {(user) => (
        <Page title={`Profil de ${user().firstName} ${user().lastName}`}>
          <section class="bg-white rounded-xl p-4 py-8 border">
            <h1 class="font-bold text-3xl">
              {user().lastName}, {user().firstName}
            </h1>
            <Graph class="min-h-96 w-full" />
          </section>
        </Page>
      )}
    </Show>
  )
}
