import { Title } from '@solidjs/meta'
import { clientOnly } from '@solidjs/start'
import { lazy } from 'solid-js'
import Page from '~/components/Page'

// @ts-ignore
$imports$

export default function () {
  return (
    <Page title="$title$" lang={'$if(lang)$$lang$$else$fr$endif$' as 'fr' | 'en'}>
      <div class="prose max-w-none">$body$</div>
    </Page>
  )
}
