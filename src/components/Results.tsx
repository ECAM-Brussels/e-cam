import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { cache, createAsync, useLocation } from '@solidjs/router'
import { For, Show } from 'solid-js'
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
  return assignments.map((record) => {
    return {
      firstName: record.user.firstName,
      lastName: record.user.lastName,
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
}, 'loadResults')

type ResultsProps = {
  url: string
}

export default function Results(props: ResultsProps) {
  const results = createAsync(() => loadResults(props.url))
  const count = () => {
    const r = results()
    return r && r.length ? r[0].questions.length : 0
  }
  return (
    <>
      <table class="container">
        <thead>
          <tr>
            <th>Last name</th>
            <th>First name</th>
            <For each={Array.from(Array(count()).keys())}>{(i) => <th>{i + 1}</th>}</For>
          </tr>
        </thead>
        <tbody>
          <For each={results()}>
            {(result) => (
              <tr>
                <td>{result.lastName}</td>
                <td>{result.firstName}</td>
                <For each={result.questions}>
                  {(q) => (
                    <>
                      <Show when={q === true}>
                        <td class="bg-green-400 text-center">
                          <Fa icon={faCheck} />
                        </td>
                      </Show>
                      <Show when={q === false}>
                        <td class="bg-red-400 text-center">
                          <Fa icon={faXmark} />
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
