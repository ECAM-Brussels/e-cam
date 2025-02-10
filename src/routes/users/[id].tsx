import { RouteDefinition, useParams } from '@solidjs/router'
import Page from '~/components/Page'
import UserProfile, { getUserAssignments } from '~/components/UserProfile'

export const route = {
  preload: ({ params }) => getUserAssignments(params.id),
} satisfies RouteDefinition

export default function User() {
  const params = useParams()
  return (
    <Page title="User">
      <UserProfile id={params.id} />
    </Page>
  )
}
