import MetaProvider, { type MetaProviderProps } from './MetaProvider'
import { ErrorBoundary } from 'solid-js'
import Breadcrumbs from '~/components/Breadcrumbs'
import Navbar from '~/components/Navbar'

type PageProps = MetaProviderProps

export default function Page(props: PageProps) {
  return (
    <MetaProvider title={props.title} lang={props.lang}>
      <Navbar />
      <Breadcrumbs />
      <div class="container mx-auto p-4">
        <ErrorBoundary
          fallback={(error) => (
            <div class="rounded-xl border bg-white p-8 shadow">
              <h1 class="font-bold text-3xl mb-8">Something went wrong</h1>
              <p>{error.toString()}</p>
            </div>
          )}
        >
          {props.children}
        </ErrorBoundary>
      </div>
    </MetaProvider>
  )
}
