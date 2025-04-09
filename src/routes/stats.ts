import { type Exercise } from '~/components/ExerciseSequence'
import { prisma } from '~/lib/db'

export async function GET() {
  const count = await prisma.user.count({})
  const assignments = await prisma.assignment.findMany({})
  let stats = { total: 0, correct: 0 }
  for (const assignment of assignments) {
    let questions: Exercise[] = (JSON.parse(String(assignment.body)) as Exercise[]) ?? []
    for (const q of questions) {
      if (q.feedback?.correct) {
        stats.correct += 1
        stats.total += 1
      } else if (q.feedback?.correct === false) {
        stats.total += 1
      }
    }
  }
  return { users: count, exercises: stats }
}
