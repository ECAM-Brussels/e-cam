import { cache, createAsync } from '@solidjs/router'
import { formatDistance } from 'date-fns'
import { For } from 'solid-js'
import { type Exercise } from '~/components/ExerciseSequence'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'

type UserProfileProps = {
  id: string
}

export const getUserAssignments = cache(async (userEmail: string) => {
  'use server'
  const user = await getUser()
  if (!user || (user.email !== userEmail && !user.admin)) {
    throw new Error("You don't have the required permissions to see this data")
  }
  const records = await prisma.assignment.findMany({ where: { userEmail } })
  return records
    .filter((record) => {
      const exercises = JSON.parse(record.body as string) as Exercise[]
      return exercises.filter((ex) => ex.feedback?.correct !== undefined).length
    })
    .map((record) => {
      const exercises = JSON.parse(record.body as string) as Exercise[]
      const correct = exercises.filter((ex) => ex.feedback?.correct).length
      const total = exercises.filter((ex) => ex.feedback?.correct !== undefined).length
      return {
        url: record.url,
        lastModified: formatDistance(record.lastModified, new Date(), { addSuffix: true }),
        correct,
        total,
        score: correct / Math.max(total, 1),
      }
    })
}, 'getUserAssignments')

export default function UserProfile(props: UserProfileProps) {
  const username = () => `${props.id}@ecam.be`
  const assignments = createAsync(() => getUserAssignments(username()))
  return (
    <div class="bg-white rounded-xl p-8">
      <h1 class="text-3xl">User: {username()}</h1>
      <table class="container">
        <thead class="border-b">
          <tr>
            <th>Assignment</th>
            <th>Exercises</th>
            <th class="text-right">Last modified</th>
          </tr>
        </thead>
        <tbody>
          <For each={assignments()}>
            {(result) => {
              return (
                <tr class="odd:bg-white even:bg-slate-50 text-slate-500 text-sm">
                  <td class="py-2">
                    <a href={result.url}>{result.url}</a>
                  </td>
                  <td>
                    <progress value={result.score} /> {result.correct}/{result.total}
                  </td>
                  <td class="text-right">{result.lastModified}</td>
                </tr>
              )
            }}
          </For>
        </tbody>
      </table>
    </div>
  )
}
