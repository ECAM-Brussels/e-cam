import { MetaProvider } from '@solidjs/meta'
import { type JSXElement } from 'solid-js'
import Breadcrumbs from '~/components/Breadcrumbs'
import Navbar from '~/components/Navbar'

type PageProps = {
  children: JSXElement
}

export default function Page(props: PageProps) {
  return (
    <MetaProvider>
      <Navbar />
      <Breadcrumbs />
      <div class="container mx-auto p-4">{props.children}</div>
    </MetaProvider>
  )
}
