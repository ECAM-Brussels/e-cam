import { createAsync, query, useLocation, useParams, type RouteDefinition } from '@solidjs/router'
import { Show } from 'solid-js'
import { z } from 'zod'
import Assignment from '~/components/Assignment'
import Page from '~/components/Page'
import { getUser } from '~/lib/auth/session'
import { getEloDiff } from '~/lib/elo'
import { getAssignment, getExercises } from '~/lib/exercises/assignment'
import { getUserInfo } from '~/lib/user'

const getOriginalAssignment = query((url?: string) => {
  'use server'
  return getAssignment({
    /** @ts-ignore */
    ...$body$,
    url,
  })
}, 'getOriginalAssignment')

const infoSchema = z.object({
  index: z.string().transform(Number).or(z.number()),
  userEmail: z.union([
    z.undefined().transform(async (_val, ctx) => {
      const user = await getUser()
      if (!user) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Not a number',
        })
        return z.NEVER
      }
      return user.email
    }),
    z.string().email(),
  ]),
  baseUrl: z.string(),
})

const getInfo = query(async (path: string, url: string) => {
  const segments = path.split('/')
  let baseUrl = url.substring(0, url.length - path.length)
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.substring(0, baseUrl.length - 1)
  }
  let info: Omit<z.input<typeof infoSchema>, 'baseUrl'>
  if (path === '' || segments.length > 2) {
    info = { index: 0, userEmail: undefined }
  } else if (segments.length === 2) {
    info = { userEmail: segments[0], index: segments[1] }
  } else {
    info = path.includes('@')
      ? { index: 0, userEmail: path }
      : { index: Number(path), userEmail: undefined }
  }
  return infoSchema.parseAsync({ ...info, baseUrl })
}, 'getInfo')

export const route = {
  async preload({ location, params }) {
    const info = await getInfo(params.path, location.pathname)
    await Promise.all([
      getUser(),
      getUserInfo(info.userEmail),
      getOriginalAssignment(info.baseUrl),
      getExercises(info.baseUrl, info.userEmail),
      getEloDiff(info.userEmail),
    ])
  },
} satisfies RouteDefinition

export default function () {
  const location = useLocation()
  const params = useParams()
  const info = createAsync(() => getInfo(params.path, location.pathname))
  const assignment = createAsync(async () => {
    if (!info()) {
      return undefined
    }
    return await getOriginalAssignment(info()!.baseUrl)
  })
  return (
    <Show when={info()}>
      {(info) => (
        <Page title={assignment()?.title ?? ''}>
          <Show when={assignment()}>
            {(assignment) => (
              <Assignment
                url={info().baseUrl}
                data={assignment()}
                userEmail={info().userEmail}
                index={info().index}
              />
            )}
          </Show>
        </Page>
      )}
    </Show>
  )
}
