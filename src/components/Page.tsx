import { type JSXElement } from 'solid-js'
import Navbar from '~/components/Navbar'
import { MetaProvider } from '@solidjs/meta'

type PageProps = {
  children: JSXElement
}

export default function Page(props: PageProps) {
  return (
    <MetaProvider>
      <Navbar />
      <div class="container mx-auto p-4">{props.children}</div>
    </MetaProvider>
  )
}
