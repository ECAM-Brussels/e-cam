import { Title } from '@solidjs/meta'
import { RouteDefinition, useSearchParams } from '@solidjs/router'
import { clientOnly } from '@solidjs/start'
import { lazy } from 'solid-js'
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
    <>
      <Title>$title$</Title>
      <Slideshow boardName={searchParams.boardName}>$body$</Slideshow>
    </>
  )
}
