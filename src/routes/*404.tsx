import { HttpStatusCode } from '@solidjs/start'
import Page from '~/components/Page'

export default function NotFound() {
  return (
    <Page>
      <div class="bg-white rounded-xl border p-8">
        <HttpStatusCode code={404} />
        <h2 class="text-3xl text-slate-800 mb-4">Erreur 404</h2>
        <p class="my-4">
          La page que vous demandez n'a pas pu être trouvée. Revenez à la{' '}
          <a class="underline" href="/">page d'accueil</a>.
        </p>
      </div>
    </Page>
  )
}
