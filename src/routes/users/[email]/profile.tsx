import UserTabs from './_tabs'
import { createAsyncStore, useParams } from '@solidjs/router'
import { type JSX } from 'solid-js'
import Page from '~/components/Page'
import { getUserInfo } from '~/lib/user'

export default function () {
  const params = useParams()
  const user = createAsyncStore(() => getUserInfo(params.email))
  return (
    <Page title="Profil">
      <UserTabs />
      <section class="bg-white rounded-xl p-4 py-8 border">
        <h1 class="font-bold text-3xl my-8">
          {user()?.lastName}, {user()?.firstName}
        </h1>
        <form method="post">
          <Field label="Prénom" value={user()?.firstName} disabled />
          <Field label="Nom" value={user()?.lastName} disabled />
          <Field label="E-mail" value={user()?.email} disabled />
          <Field label="Rôle" value={user()?.role} disabled />
        </form>
      </section>
    </Page>
  )
}

function Field(props: JSX.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label class="grid grid-cols-4 my-1 items-center gap-4">
      <p class="text-right text-gray-600">{props.label}</p>{' '}
      <input class="border py-2 px-2 col-span-3" {...props} />
    </label>
  )
}
