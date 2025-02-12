import { query, createAsync } from '@solidjs/router'
import { createSignal, For } from 'solid-js'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'

const getUsers = query(async () => {
  'use server'
  const user = await getUser()
  if (!user?.admin) {
    throw new Error('Only admins can access user information')
  }
  const users = await prisma.user.findMany()
  return users
}, 'getUsers')

type UserSelectProps = {
  onSelect?: (userId: string) => void
}

export default function UserSelect(props: UserSelectProps) {
  const [search, setSearch] = createSignal('')
  const users = createAsync(() => getUsers())
  return (
    <>
      <input
        list="users"
        class="border rounded-full w-full px-4 py-3 my-2 shadow-md"
        placeholder="Look up a student"
        value={search()}
        onInput={(e) => {
          const filtered = users()?.filter((u) => u.email.split('@')[0] === e.target.value)
          if (filtered?.length === 1) {
            props.onSelect?.(filtered[0].email.split('@')[0])
            setSearch(filtered[0].email.split('@')[0])
          }
        }}
      />
      <datalist id="users">
        <For each={users()}>
          {(user) => (
            <option value={user.email.split('@')[0]}>
              {user.lastName}, {user.firstName}
            </option>
          )}
        </For>
      </datalist>
    </>
  )
}
