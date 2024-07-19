import { type JSXElement } from 'solid-js'

type PageProps = {
  children: JSXElement
}

export default function Page(props: PageProps) {
  return <div class="bg-white container mx-auto p-4 rounded-b-xl shadow-lg">{props.children}</div>
}
