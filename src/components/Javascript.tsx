import Spinner from './Spinner'
import { createAsync } from '@solidjs/router'
import dedent from 'dedent-js'
import { Suspense } from 'solid-js'
import Html, { type Props } from '~/components/Html'
import { transform } from '~/lib/repl/babel'

type JavascriptProps = Props & {
  framework?: 'react' | 'solid' | 'svelte'
  render?: string
}

export default function Javascript(props: JavascriptProps) {
  const code = createAsync(
    async () =>
      dedent`
        <script type="module">
        ${await transform(props.value, props.framework, props.render)}
        </script>
      `,
    { initialValue: '' },
  )
  return (
    <Suspense fallback={<Spinner />}>
      <Html {...props} value={code()} />
    </Suspense>
  )
}
