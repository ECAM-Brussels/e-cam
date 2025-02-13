import UserSelect from './UserSelect'
import { createAsync } from '@solidjs/router'
import { For, Show } from 'solid-js'
import { getUserAssignments } from '~/lib/assignments'
import { getUser } from '~/lib/auth/session'
import { getUserInfo } from '~/lib/user'

type UserProfileProps = {
  id: string
  onSelect?: (newUser: string) => void
}

export default function UserProfile(props: UserProfileProps) {
  const username = () => `${props.id}@ecam.be`
  const assignments = createAsync(() => getUserAssignments(username()))
  const user = createAsync(() => getUser())
  const userInfo = createAsync(() => getUserInfo(username()))
  const suffix = () => username() !== user()?.email ? `?userEmail=${username()}` : ''
  return (
    <div class="bg-white rounded-xl p-8 border shadow">
      <Show when={user()?.admin}>
        <UserSelect onSelect={props.onSelect} />
      </Show>
      <h1 class="text-4xl font-bold my-8">{userInfo()?.lastName}, {userInfo()?.firstName}</h1>
      <table class="container max-w-5xl mx-auto border shadow mb-8">
        <thead class="border-b">
          <tr>
            <th class="p-3">Assignment</th>
            <th class="border p-3">Exercises</th>
            <th class="border text-right whitespace-nowrap p-3">Last modified</th>
          </tr>
        </thead>
        <tbody>
          <For each={assignments()}>
            {(result) => {
              return (
                <tr class="odd:bg-white even:bg-slate-50 text-slate-500 text-sm">
                  <td class="border flex-grow p-3">
                    <a href={result.url + suffix()}>{result.title}</a>
                  </td>
                  <td class="border p-3 w-0 whitespace-nowrap">
                    <progress value={result.score} /> {result.correct}/{result.total}
                  </td>
                  <td class="border p-3 text-right w-0 whitespace-nowrap">{result.lastModified}</td>
                </tr>
              )
            }}
          </For>
        </tbody>
      </table>
    </div>
  )
}
