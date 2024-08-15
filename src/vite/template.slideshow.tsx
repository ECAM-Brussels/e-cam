import { useSearchParams } from '@solidjs/router'
import { clientOnly } from '@solidjs/start'
import { lazy } from 'solid-js'
import Slide from '~/components/Slide'
import Slideshow from '~/components/Slideshow'

const Code = lazy(() => import('~/components/Code'))
const Environment = lazy(() => import('~/components/Environment'))
const Math = clientOnly(() => import('~/components/Math'))

export default function () {
  const [searchParams] = useSearchParams()
  return <Slideshow boardName={searchParams.boardName}>$body$</Slideshow>
}
