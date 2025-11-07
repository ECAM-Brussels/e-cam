import type { ResultOf, VariablesOf } from '@graphql-typed-document-node/core'
import { request as gRequest } from 'graphql-request'

let url = process.env.VITE_GRAPHQL_URL ?? 'http://symapi:8000/graphql'

type Args = Parameters<typeof gRequest>
export function request<T extends Args[1]>(
  query: T,
  variables: VariablesOf<T>,
): Promise<ResultOf<T>> {
  return gRequest(url, query, variables as Args[2]) as Promise<ResultOf<T>>
}

type Query<T extends Args[1], S = ResultOf<T>, P extends any[] = [VariablesOf<T>]> = {
  query: T
  pre?: (...args: P) => VariablesOf<T>
  post?: (result: ResultOf<T>) => S
}

export function createQuery<P extends any[], T extends Args[1], S>({
  query,
  pre,
  post,
}: Query<T, S, P>) {
  const preprocess = pre ?? ((...args: [VariablesOf<T>]) => args[0])
  const postprocess = post ?? ((data: ResultOf<T>) => data as S)
  return async function (...args: P): Promise<S> {
    const variables = preprocess(...args)
    const data = await request<T>(query, variables)
    return postprocess(data)
  }
}
