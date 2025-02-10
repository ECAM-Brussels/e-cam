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
  return records.map((record) => {
    const exercises = JSON.parse(record.body as string) as Exercise[]
    const correct = exercises.map((ex) => ex.feedback?.correct).length
    return {
      url: record.url,
      lastModified: formatDistance(record.lastModified, new Date(), { addSuffix: true }),
      correct,
      total: exercises.length,
      score: correct / Math.max(exercises.length, 1),
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
            <th>Last modified</th>
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
                  <td
                    class="text-white text-center"
                    classList={{ 'bg-green-700': result.score > 0.7 }}
                  >
                    {result.correct}/{result.total} ({result.score * 100}%)
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
