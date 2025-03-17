import ErrorBoundary from './ErrorBoundary'
import MetaProvider, { type MetaProviderProps } from './MetaProvider'
import Breadcrumbs from '~/components/Breadcrumbs'
import Navbar from '~/components/Navbar'

type PageProps = MetaProviderProps

export default function Page(props: PageProps) {
  return (
    <MetaProvider title={props.title} lang={props.lang}>
      <Navbar />
      <Breadcrumbs />
      <div class="container mx-auto p-4">
        <ErrorBoundary>{props.children}</ErrorBoundary>
      </div>
    </MetaProvider>
  )
}
