import { type JSXElement } from 'solid-js'
import Navbar from '~/components/Navbar'

type PageProps = {
  children: JSXElement
}

export default function Page(props: PageProps) {
  return (
    <>
      <Navbar />
      <div class="container mx-auto p-4">{props.children}</div>
    </>
  )
}
