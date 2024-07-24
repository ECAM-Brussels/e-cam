import { type JSXElement } from 'solid-js'
import Navbar from '~/components/Navbar'

type PageProps = {
  children: JSXElement
}

export default function Page(props: PageProps) {
  return (
    <div class="bg-white container mx-auto p-4 rounded-b-xl shadow-lg">
      <Navbar />
      {props.children}
    </div>
  )
}
