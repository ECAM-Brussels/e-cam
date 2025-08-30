import { Title } from '@solidjs/meta'
import { type RouteDefinition } from '@solidjs/router'
import { clientOnly } from '@solidjs/start'
import { lazy } from 'solid-js'
import Page from '~/components/Page'
import { getUser } from '~/lib/auth/session'

export const route = {
  preload() {
    getUser()
  },
} satisfies RouteDefinition

// @ts-ignore
$imports$

export default function () {
  return (
    <Page title="$title$" lang={'$if(lang)$$lang$$else$fr$endif$' as 'fr' | 'en'}>
      <div class="prose max-w-none">$body$</div>
    </Page>
  )
}
