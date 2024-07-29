import { faCheck, faQuestion, faXmark } from '@fortawesome/free-solid-svg-icons'
import { cache, createAsync, useLocation } from '@solidjs/router'
import Fuse from 'fuse.js'
import { createSignal, For, Show } from 'solid-js'
import { type Exercise } from '~/components/ExerciseSequence'
import Fa from '~/components/Fa'
import { prisma } from '~/lib/db'

export const loadResults = cache(async (url: string) => {
  'use server'
  const assignments = await prisma.assignment.findMany({
    where: { url },
    orderBy: [
      {
        user: {
          lastName: 'asc',
        },
      },
      {
        user: {
          firstName: 'asc',
        },
      },
    ],
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  })
  const list = assignments.map((record) => {
    return {
      firstName: record.user.firstName,
      lastName: record.user.lastName,
      email: record.userEmail,
      questions: (JSON.parse(String(record.body)) as Exercise[]).map((question) => {
        if (question.feedback?.correct) {
          return true
        } else if (question.feedback?.correct === false) {
          return false
        }
        return undefined
      }),
    }
  })
  list.push({
    firstName: 'tuxie',
    lastName: 'hello',
    email: 'tux@ecam.be',
    questions: [true, true, true, true, false, undefined],
  })
  return list
}, 'loadResults')

type ResultsProps = {
  url: string
}

export default function Results(props: ResultsProps) {
  const [search, setSearch] = createSignal('')
  const results = createAsync(() => loadResults(props.url))
  const count = () => {
    const r = results()
    return r && r.length ? r[0].questions.length : 0
  }

  const filtered = () => {
    if (!search()) {
      return results()
    }
    const fuse = new Fuse(results() || [], { keys: ['lastName', 'firstName'] })
    return fuse.search(search()).map((r) => r.item)
  }

  return (
    <>
      <p class="my-4">
        <input
          class="border rounded-xl w-full px-3 py-1"
          placeholder="Rechercher un étudiant"
          value={search()}
          onInput={(e) => setSearch(e.target.value)}
        />
      </p>
      <table class="container">
        <thead class="border-b">
          <tr class="text-xs">
            <th>Matricule</th>
            <th>Last name</th>
            <th>First name</th>
            <For each={Array.from(Array(count()).keys())}>{(i) => <th>{i + 1}</th>}</For>
          </tr>
        </thead>
        <tbody>
          <For each={filtered()}>
            {(result) => (
              <tr class="odd:bg-white even:bg-slate-50 text-slate-500 text-sm">
                <td class="py-2">{result.email.split('@')[0]}</td>
                <td>{result.lastName}</td>
                <td>{result.firstName}</td>
                <For each={result.questions}>
                  {(q) => (
                    <>
                      <Show when={q === true}>
                        <td class="bg-green-100 text-green-700 text-center">
                          <Fa icon={faCheck} />
                        </td>
                      </Show>
                      <Show when={q === false}>
                        <td class="bg-red-100 text-red-700 text-center">
                          <Fa icon={faXmark} />
                        </td>
                      </Show>
                      <Show when={q === undefined}>
                        <td class="bg-gray-100 text-gray-700 text-center">
                          <Fa icon={faQuestion} />
                        </td>
                      </Show>
                    </>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </>
  )
}
