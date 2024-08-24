import { type JSXElement } from 'solid-js'
import Page from '~/components/Page'

export default function Home() {
  return (
    <Page>
      <section>
        <h2 class="text-3xl text-slate-800 mb-4">Cours</h2>
        <div class="grid lg:grid-cols-2">
          <Card src="images/PM1C.webp" alt="Pont mathématiques" href="/PM1C/">
            <h3>Pont mathématiques vers le supérieur (ba1)</h3>
          </Card>
        </div>
      </section>
    </Page>
  )
}

type CardProps = {
  alt: string
  children?: JSXElement
  src: string
  href: string
}

function Card(props: CardProps) {
  return (
    <a href={props.href}>
      <div class="bg-white rounded-xl shadow">
        <img
          src={props.src}
          alt={props.alt}
          class="rounded-t opacity-60 max-h-64 object-cover w-full"
        />
        <div class="px-2 py-4 prose">{props.children}</div>
      </div>
    </a>
  )
}
