import Slideshow from '~/components/Slideshow'
import Slide from '~/components/Slide'
import { lazy } from 'solid-js'

const Environment = lazy(() => import('~/components/Environment'))
const Math = lazy(() => import('~/components/Math'))

export default function () {
  return <Slideshow>$body$</Slideshow>
}