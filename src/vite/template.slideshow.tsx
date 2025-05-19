import { RouteDefinition, useLocation, useParams, useSearchParams } from '@solidjs/router'
import { clientOnly } from '@solidjs/start'
import { lazy } from 'solid-js'
import { z } from 'zod'
import MetaProvider from '~/components/MetaProvider'

const Slideshow = clientOnly(() => import('~/components/Slideshow'))

// @ts-ignore
$imports$

export const route = {} satisfies RouteDefinition

const index = z.coerce.number().default(1)

export default function () {
  const params = useParams()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const url = () => {
    const parts = location.pathname.split('/')
    for (const p of [params.board, params.slide]) {
      if (p) parts.pop()
    }
    return parts.join('/')
  }
  return (
    <MetaProvider title="$title$" lang={'$if(lang)$$lang$$else$fr$endif$' as 'fr' | 'en'}>
      <Slideshow
        board={searchParams.boardName as string}
        hIndex={index.parse(params.slide)}
        vIndex={index.parse(params.board)}
        url={url()}
      >
        $body$
      </Slideshow>
    </MetaProvider>
  )
}
