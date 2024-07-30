import Slideshow from '~/components/Slideshow'
import Slide from '~/components/Slide'
import { lazy } from 'solid-js'

const Code = lazy(() => import('~/components/Code'))
const Environment = lazy(() => import('~/components/Environment'))
const Math = lazy(() => import('~/components/Math'))

export default function () {
  return <Slideshow>$body$</Slideshow>
}