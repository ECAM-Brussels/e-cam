import { json } from '@solidjs/router'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { assignmentSchema } from '~/lib/exercises/assignment'

export function GET() {
  const schema = zodToJsonSchema(
    assignmentSchema.omit({
      url: true,
    }),
  )
  return json(schema, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  })
}
