import { type JSXElement } from 'solid-js'
import Page from '~/components/Page'

export default function Home() {
  return (
    <Page>
      <section>
        <h2 class="text-3xl text-slate-800 mb-4">Cours</h2>
        <div class="grid lg:grid-cols-2 gap-8">
          <Card src="images/PM1C.png" alt="Pont mathématiques" href="/PM1C/">
            <h3>Pont mathématiques vers le supérieur (ba1)</h3>
          </Card>
          <Card src="images/IC1T.png" alt="Programmation" href="/IC1T/">
            <h3>Programmation</h3>
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
      <div class="bg-white rounded-xl shadow transition ease-in-out hover:scale-105">
        <img
          src={props.src}
          alt={props.alt}
          class="rounded-t opacity-60 h-96 object-cover w-full"
        />
        <div class="px-2 py-4 prose">{props.children}</div>
      </div>
    </a>
  )
}
