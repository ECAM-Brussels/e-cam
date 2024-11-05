import { RouteDefinition, useSearchParams } from '@solidjs/router'
import { clientOnly } from '@solidjs/start'
import { lazy } from 'solid-js'
import MetaProvider from '~/components/MetaProvider'
import { getBoardCount } from '~/components/Slideshow'

const Slideshow = clientOnly(() => import('~/components/Slideshow'))

// @ts-ignore
$imports$

export const route = {
  load: ({ location }) => {
    const search = new URLSearchParams(location.search)
    getBoardCount(location.pathname, search.get('boardName') || '')
  },
} satisfies RouteDefinition

export default function () {
  const [searchParams] = useSearchParams()
  return (
    <MetaProvider title="$title$" lang={'$if(lang)$$lang$$else$fr$endif$' as 'fr' | 'en'}>
      <Slideshow boardName={searchParams.boardName}>$body$</Slideshow>
    </MetaProvider>
  )
}
