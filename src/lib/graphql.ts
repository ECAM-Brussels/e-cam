import type { ResultOf, VariablesOf } from '@graphql-typed-document-node/core'
import { request as gRequest } from 'graphql-request'
import { isServer } from 'solid-js/web'

let url = 'http://127.0.0.1:8000/graphql'
if (!isServer) {
  url = import.meta.env.VITE_GRAPHQL_URL || url
}

type Args = Parameters<typeof gRequest>
export function request<T extends Args[1]>(
  query: T,
  variables: VariablesOf<T>,
): Promise<ResultOf<T>> {
  return gRequest(url, query, variables as Args[2]) as Promise<ResultOf<T>>
}
