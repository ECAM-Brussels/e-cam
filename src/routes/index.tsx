import Page from '~/components/Page'
import Whiteboard from '~/components/Whiteboard'

export default function Home() {
  return (
    <Page>
      <section>
        <h2>Une plateforme d'apprentissage</h2>
        <Whiteboard class="border-2 border-red-300" width={800} height={800} />
      </section>
    </Page>
  )
}
