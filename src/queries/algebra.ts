import { graphql } from '~/gql'
import { createQuery } from '~/lib/graphql'

export const checkEqual = createQuery({
  query: graphql(`
    query EqualityCheck($expr1: Math!, $expr2: Math!, $error: Float!) {
      expression(expr: $expr1) {
        isApproximatelyEqual(expr: $expr2, error: $error)
      }
    }
  `),
  pre: (expr1: string, expr2: string, error?: number) => ({ expr1, expr2, error: error ?? 0 }),
  post: ({ expression }) => expression.isApproximatelyEqual,
})

export const checkFactorisation = createQuery({
  query: graphql(`
    query CheckFactorisation($expr: Math!, $attempt: Math!) {
      attempt: expression(expr: $attempt) {
        isEqual(expr: $expr)
        isFactored
      }
    }
  `),
  pre: (attempt: string, expr: string) => ({ attempt, expr }),
  post: ({ attempt }) => attempt.isEqual && attempt.isFactored,
})

export const expand = createQuery({
  query: graphql(`
    query ExpandExpr($expr: Math!) {
      expression(expr: $expr) {
        expand {
          expr
        }
      }
    }
  `),
  pre: (expr: string) => ({ expr }),
  post: (result) => result.expression.expand.expr,
})

export const factor = createQuery({
  query: graphql(`
    query Factor($expr: Math!) {
      expression(expr: $expr) {
        factor {
          expr
        }
      }
    }
  `),
  pre: (expr: string) => ({ expr }),
  post: ({ expression }) => expression.factor.expr,
})

export const getFirstRoot = createQuery({
  query: graphql(`
    query GetFirstRoot($expr: Math!) {
      expression(expr: $expr) {
        solveset {
          index(i: 0) {
            expr
          }
        }
      }
    }
  `),
  pre: (expr: string) => ({ expr }),
  post: (res) => res.expression.solveset.index.expr,
})

export const normalizePolynomial = createQuery({
  query: graphql(`
    query NormalizePolynomial($expr: Math!) {
      expression(expr: $expr) {
        normalizeRoots {
          expr
        }
      }
    }
  `),
  pre: (expr: string) => ({ expr }),
  post: ({ expression }) => expression.normalizeRoots.expr,
})
