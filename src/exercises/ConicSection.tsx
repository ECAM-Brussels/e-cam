import { cache } from '@solidjs/router'
import { z } from 'zod'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

const point = z.tuple([z.string(), z.string()])

export const schema = z.object({
  equation: z.string(),
  attempt: z
    .object({
      type: z.literal('parabola').or(z.literal('ellipse')).or(z.literal('hyperbola')),
      center: z.string(),
      foci: z.string().array(),
      vertices: z.string().array(),
    })
    .optional(),
})
export type State = z.infer<typeof schema>

export const mark = cache(async (state: State) => {
  'use server'
  const { conicSection } = await request(
    graphql(`
      query CheckConicSection(
        $equation: Math!
        $center: Math!
        $vertices: [Math!]!
        $foci: [Math!]!
      ) {
        conicSection(equation: $equation) {
          type
          center {
            isEqual(expr: $center)
          }
          vertices {
            isSetEqual(items: $vertices)
          }
          foci {
            isSetEqual(items: $foci)
          }
        }
      }
    `),
    {
      equation: state.equation,
      center: state.attempt?.center || '',
      foci: state.attempt?.foci || [],
      vertices: state.attempt?.vertices || [],
    },
  )
  if (conicSection.type !== state.attempt?.type || !conicSection.center.isEqual || !conicSection.foci.isSetEqual) {
    return false
  }
  return conicSection.type === 'parabola' || conicSection.vertices.isSetEqual
}, 'checkConicSection')
