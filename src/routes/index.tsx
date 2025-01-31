import { For, type JSXElement } from 'solid-js'
import Page from '~/components/Page'

type Course = {
  href: string
  src: string
  title: string
}

const courses: Course[] = [
  {
    href: '/PM1C/',
    src: '/images/PM1C.png',
    title: 'Pont vers le supérieur: mathématiques',
  },
  {
    href: '/IC1T/',
    src: '/images/IC1T.png',
    title: 'Programmation',
  },
  {
    href: '/LW3L/',
    src: '/images/LW3L.png',
    title: 'Web Technologies',
  },
  {
    href: '/AW4C/',
    src: '/images/LW3L.png',
    title: 'Web Architecture for Business Analysts',
  },
  {
    href: '/SA4T/',
    src: '/images/SA4T.webp',
    title: 'Algorithms',
  },
  {
    href: '/AW4L/',
    src: '/images/AW4L.webp',
    title: 'Web Architecture',
  },
]

export default function Home() {
  return (
    <Page title="Accueil">
      <section>
        <h2 class="text-3xl text-slate-800 mb-4">Cours</h2>
        <div class="grid lg:grid-cols-2 gap-8">
          <For each={courses}>
            {(course) => (
              <Card src={course.src} alt={course.title} href={course.href}>
                <h3>{course.title}</h3>
              </Card>
            )}
          </For>
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
          loading="lazy"
        />
        <div class="px-2 py-4 prose">{props.children}</div>
      </div>
    </a>
  )
}
