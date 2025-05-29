import UserTabs from './_tabs'
import { createAsyncStore, type RouteDefinition, useParams } from '@solidjs/router'
import { Suspense } from 'solid-js'
import AssignmentTable from '~/components/AssignmentTable'
import Page from '~/components/Page'
import { getUser } from '~/lib/auth/session'
import { getAssignmentList } from '~/lib/exercises/assignment'
import { getUserInfo } from '~/lib/user'

export const route = {
  preload({ params }) {
    getUser()
    getUserInfo(params.email)
    getAssignmentList()
  },
} satisfies RouteDefinition

export default function () {
  const params = useParams()
  const user = createAsyncStore(() => getUserInfo(params.email))
  return (
    <Suspense>
      <Page title={`Profil de ${user()?.firstName} ${user()?.lastName}`}>
        <UserTabs />
        <section class="bg-white rounded-xl p-4 py-8 border">
          <h1 class="font-bold text-3xl my-8">
            {user()?.lastName}, {user()?.firstName}
          </h1>
          <AssignmentTable />
        </section>
      </Page>
    </Suspense>
  )
}
