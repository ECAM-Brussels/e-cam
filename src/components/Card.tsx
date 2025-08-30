import { type JSXElement } from 'solid-js'

export default function Card(props: { image: string; href: string; children: JSXElement }) {
  return (
    <a href={props.href}>
      <section class="bg-white rounded-xl shadow transition ease-in-out hover:scale-105">
        <img src={props.image} class="rounded-t-xl object-cover w-full h-96" />
        <div class="px-4 py-4 prose">{props.children}</div>
      </section>
    </a>
  )
}
