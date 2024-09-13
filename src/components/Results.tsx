import { faCheck, faQuestion, faXmark } from '@fortawesome/free-solid-svg-icons'
import { cache, createAsync } from '@solidjs/router'
import Fuse from 'fuse.js'
import { countBy } from 'lodash-es'
import { createSignal, For, Show } from 'solid-js'
import { type Exercise } from '~/components/ExerciseSequence'
import Fa from '~/components/Fa'
import { prisma } from '~/lib/db'

export const loadResults = cache(async (url: string, id: string) => {
  'use server'
  const users = await prisma.user.findMany({
    include: {
      assignments: {
        where: { url, id },
      },
    },
    orderBy: [
      {
        lastName: 'asc',
      },
      {
        firstName: 'asc',
      },
    ],
  })
  return users.map((record) => {
    let questions: Exercise[] = []
    if (record.assignments.length) {
      questions = JSON.parse(String(record.assignments[0].body))
    }
    return {
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      attempted: record.assignments.length > 0,
      finished: record.assignments.length > 0 && record.assignments[0].finished,
      questions: questions.map((question) => {
        if (question.feedback?.correct) {
          return true
        } else if (question.feedback?.correct === false) {
          return false
        }
        return undefined
      }),
    }
  })
}, 'loadResults')

type ResultsProps = {
  id?: string
  url: string
}

export default function Results(props: ResultsProps) {
  const [search, setSearch] = createSignal('')
  const results = createAsync(() => loadResults(props.url, props.id || ''))
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
          class="border rounded-full w-full px-4 py-3 my-2 shadow-md"
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
            <th>Finished</th>
            <th class="text-right pr-4">%</th>
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
                <Show
                  when={result.finished}
                  fallback={
                    <td class="bg-red-100 text-red-700 text-center">
                      <Fa icon={faXmark} />
                    </td>
                  }
                >
                  <td class="bg-green-100 text-green-700 text-center">
                    <Fa icon={faCheck} />
                  </td>
                </Show>
                <td class="text-right pr-4">
                  {Math.round((countBy(result.questions)['true'] / result.questions.length) * 100)}%
                </td>
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
        <tfoot>
          <tr class="border-t">
            <td colspan={4}></td>
            <td class="text-center">0</td>
          </tr>
        </tfoot>
      </table>
    </>
  )
}
