import Slideshow from '~/components/Slideshow'
import Slide from '~/components/Slide'
import { lazy } from 'solid-js'
import { useSearchParams } from '@solidjs/router'

const Code = lazy(() => import('~/components/Code'))
const Environment = lazy(() => import('~/components/Environment'))
const Math = lazy(() => import('~/components/Math'))

export default function () {
  const [searchParams] = useSearchParams()
  return <Slideshow boardName={searchParams.boardName}>$body$</Slideshow>
}