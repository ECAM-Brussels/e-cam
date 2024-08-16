import { RouteDefinition, useSearchParams } from '@solidjs/router'
import { clientOnly } from '@solidjs/start'
import { lazy } from 'solid-js'
import Slide from '~/components/Slide'
import { getBoardCount } from '~/components/Slideshow'

const Code = lazy(() => import('~/components/Code'))
const Environment = lazy(() => import('~/components/Environment'))
const Math = clientOnly(() => import('~/components/Math'))
const Slideshow = clientOnly(() => import('~/components/Slideshow'))

export const route = {
  load: ({ location }) => {
    const search = new URLSearchParams(location.search)
    getBoardCount(location.pathname, search.get('boardName') || '')
  }
} satisfies RouteDefinition

export default function () {
  const [searchParams] = useSearchParams()
  return <Slideshow boardName={searchParams.boardName}>$body$</Slideshow>
}
