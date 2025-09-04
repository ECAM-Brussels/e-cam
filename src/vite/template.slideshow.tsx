import { RouteDefinition, useLocation, useParams, useSearchParams } from '@solidjs/router'
import { clientOnly } from '@solidjs/start'
import { createMemo, lazy } from 'solid-js'
import { z } from 'zod'
import MetaProvider from '~/components/MetaProvider'
import { loadBoard } from '~/lib/board'
import { getBoardCount } from '~/lib/slideshow'

const Slideshow = clientOnly(() => import('~/components/Slideshow'))

// @ts-ignore
$imports$

const url = (pathname: string, params: string[]) => {
  const parts = pathname.split('/')
  for (const p of params) {
    if (p) parts.pop()
  }
  return parts.join('/')
}

const index = z.coerce.number().default(1)

export const route = {
  async preload({ location, params }) {
    const u = url(location.pathname, [params.board, params.slide])
    await Promise.all([
      getBoardCount(u, 'ngy@ecam.be', '', index.parse(params.slide)),
      loadBoard({
        url: u,
        ownerEmail: 'ngy@ecam.be',
        board: '-' + index.parse(params.slide) + '-' + index.parse(params.board),
      }),
    ])
  },
} satisfies RouteDefinition

// @ts-ignore
const children = createMemo(() => [$body$])

export default function () {
  const params = useParams()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const showBoard = () => z.coerce.number().parse(searchParams.showBoard ?? 1) === 1
  return (
    <MetaProvider title="$title$" lang={'$if(lang)$$lang$$else$fr$endif$' as 'fr' | 'en'}>
      <Slideshow
        board={(searchParams.boardName as string) ?? ''}
        hIndex={index.parse(params.slide)}
        vIndex={index.parse(params.board)}
        url={url(location.pathname, [params.board, params.slide])}
        slides={children()}
        showBoard={showBoard()}
        onShowBoardChange={(value) => {
          setSearchParams({ showBoard: value ? 1 : 0 })
        }}
      />
    </MetaProvider>
  )
}
