import { clientOnly } from '@solidjs/start'
import { lazy } from 'solid-js'
import Page from '~/components/Page'
import { Title } from "@solidjs/meta";

// @ts-ignore
$imports$

export default function () {
  return (
    <Page>
      <Title>$title$</Title>
      <div class="prose max-w-none">$body$</div>
    </Page>
  )
}
