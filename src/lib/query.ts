import { action, createAsyncStore, query, useSubmission } from '@solidjs/router'
import { createEffect } from 'solid-js'
import { createStore, unwrap } from 'solid-js/store'
import { isServer } from 'solid-js/web'

type Mutation<T extends object> = {
  server: (record: T) => Promise<T>
  client?: (records: T[], record: T) => T[]
  validate?: (data: object) => Partial<T>
}

export function queryMany<T extends object>(
  queryFn: () => Promise<T[]>,
  key: string,
  mutators: { [key: string]: Mutation<T> } = {},
) {
  const q = query(queryFn, key)
  const serverData = createAsyncStore(() => q(), { initialValue: [] })

  const [data, setData] = createStore<T[]>(unwrap(serverData()))
  createEffect(() => setData(serverData))

  const mutations = Object.fromEntries(
    Object.entries(mutators).map(([name, mutator]) => {
      function preprocess(form: FormData): T {
        let record = Object.fromEntries(form.entries()) as T
        if (mutator.validate) {
          record = mutator.validate(record) as T
        }
        return record
      }
      const act = action((form: FormData) => {
        let record = preprocess(form)
        if (!isServer) {
          let dataCopy = unwrap(data)
          if (mutator.client) {
            dataCopy = mutator.client(dataCopy, record)
          }
          setData(dataCopy)
        }
        return mutator.server(record)
      }, `${key}-action-${name}`)
      const submission = useSubmission(act)
      return [
        name,
        {
          action: act,
          get pending() {
            return submission.pending
          },
          get current() {
            return submission.input && preprocess(submission.input[0])
          },
        },
      ]
    }),
  )
  return [data, mutations]
}
