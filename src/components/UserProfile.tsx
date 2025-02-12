import UserSelect from './UserSelect'
import { createAsync } from '@solidjs/router'
import { For, Show } from 'solid-js'
import { getUserAssignments } from '~/lib/assignments'
import { getUser } from '~/lib/auth/session'

type UserProfileProps = {
  id: string
  onSelect?: (newUser: string) => void
}

export default function UserProfile(props: UserProfileProps) {
  const username = () => `${props.id}@ecam.be`
  const assignments = createAsync(() => getUserAssignments(username()))
  const user = createAsync(() => getUser())
  return (
    <div class="bg-white rounded-xl p-8">
      <Show when={user()?.admin}>
        <UserSelect onSelect={props.onSelect} />
      </Show>
      <h1 class="text-3xl">User: {username()}</h1>
      <table class="container">
        <thead class="border-b">
          <tr>
            <th>Assignment</th>
            <th>Exercises</th>
            <th class="text-right whitespace-nowrap">Last modified</th>
          </tr>
        </thead>
        <tbody>
          <For each={assignments()}>
            {(result) => {
              return (
                <tr class="odd:bg-white even:bg-slate-50 text-slate-500 text-sm">
                  <td class="py-2 flex-grow">
                    <a href={result.url}>{result.url}</a>
                  </td>
                  <td class="w-0 whitespace-nowrap">
                    <progress value={result.score} /> {result.correct}/{result.total}
                  </td>
                  <td class="text-right w-0 whitespace-nowrap">{result.lastModified}</td>
                </tr>
              )
            }}
          </For>
        </tbody>
      </table>
    </div>
  )
}
