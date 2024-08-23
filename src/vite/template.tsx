import { clientOnly } from '@solidjs/start'
import { lazy } from 'solid-js'
import Page from '~/components/Page'

// @ts-ignore
$imports$

export default function () {
  return (
    <Page>
      <div class="prose max-w-none">$body$</div>
    </Page>
  )
}
