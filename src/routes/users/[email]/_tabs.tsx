import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { createAsync, useLocation, useParams } from '@solidjs/router'
import Fuse from 'fuse.js'
import { createMemo, createSignal, For, Show } from 'solid-js'
import Fa from '~/components/Fa'
import Tabs from '~/components/Tabs'
import { getUser } from '~/lib/auth/session'
import { getUsers, viewProfile } from '~/lib/user'

export default function UserTabs() {
  const params = useParams()
  const user = createAsync(() => getUser())
  const [search, setSearch] = createSignal('')
  const students = createAsync(() => getUsers(), { initialValue: [] })
  const fuse = createMemo(() => {
    const results = students()
    if (!results || results.length === 0) return null
    return new Fuse(results, { keys: ['lastName', 'firstName', 'email'] })
  })
  const filtered = () =>
    search()
      ? (fuse()
          ?.search(search())
          .map((r) => r.item) ?? students())
      : students()

  const location = useLocation()
  const path = () => location.pathname.split('/').slice(3).join('/')
  return (
    <>
      <Show when={user()?.role !== 'STUDENT'}>
        <form method="post" class="w-4/5 mx-auto text-center mb-8 flex" action={viewProfile}>
          <input
            class="border bg-slate-50 rounded-s-lg w-full px-4 py-2"
            list="students"
            value={search()}
            onInput={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un étudiant..."
          />
          <button class="bg-sky-700 rounded-e-lg text-sky-50 px-4">
            <Fa icon={faMagnifyingGlass} />
          </button>
          <datalist id="students">
            <For each={filtered()}>
              {(student) => (
                <option value={student.email}>
                  {student.lastName}, {student.firstName} ({student.score})
                </option>
              )}
            </For>
          </datalist>
          <input type="hidden" name="email" value={filtered().at(0)?.email} />
          <input type="hidden" name="path" value={path()} />
        </form>
      </Show>
      <Tabs
        links={[
          { href: `/users/${params.email}`, children: 'Profil' },
          { href: `/users/${params.email}/math`, children: 'Mathématiques' },
          { href: `/users/${params.email}/history`, children: 'Historique' },
        ]}
      />
    </>
  )
}
