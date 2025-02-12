import { redirect, RouteDefinition, useNavigate, useParams } from '@solidjs/router'
import { createSignal } from 'solid-js'
import Page from '~/components/Page'
import UserProfile from '~/components/UserProfile'
import { getUserAssignments } from '~/lib/assignments'
import { getUser } from '~/lib/auth/session'

export const route = {
  preload: ({ params }) => {
    getUser()
    getUserAssignments(params.id)
  },
} satisfies RouteDefinition

export default function User() {
  const params = useParams()
  const navigate = useNavigate()
  return (
    <Page title="User">
      <UserProfile
        id={params.id}
        onSelect={(newId: string) => {
          navigate(`../${newId}`)
        }}
      />
    </Page>
  )
}
