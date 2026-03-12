import { query } from '@solidjs/router'
import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export const checkEqual = query(
  async (expr1: string, expr2: string, error: number = 0): Promise<boolean> => {
    'use server'
    try {
      const { expression } = await request(
        graphql(`
          query EqualityCheck(
            $expr1: Math!
            $expr2: Math!
            $error: Float!
            $approximately: Boolean!
          ) {
            expression(expr: $expr1) {
              isApproximatelyEqual(expr: $expr2, error: $error) @include(if: $approximately)
              isEqual(expr: $expr2) @skip(if: $approximately)
            }
          }
        `),
        { expr1, expr2, error, approximately: error !== 0 },
      )
      return (expression.isEqual ?? expression.isApproximatelyEqual) === true
    } catch {
      return false
    }
  },
  'checkEqual',
)

export async function checkFactorisation(attempt: string, expr: string) {
  'use server'
  const { expression } = await request(
    graphql(`
      query CheckFactor($expr: Math!, $attempt: Math!) {
        expression(expr: $attempt) {
          isEqual(expr: $expr)
          isFactored
        }
      }
    `),
    { attempt, expr },
  )
  return expression.isEqual && expression.isFactored
}

export async function expand(expr: string, simplify = false) {
  'use server'
  const { expression } = await request(
    graphql(`
      query ExpandExpr($expr: Math!, $simplify: Boolean!) {
        expression(expr: $expr) {
          expand {
            expr
            simplify @include(if: $simplify) {
              expr
            }
          }
        }
      }
    `),
    { expr, simplify },
  )
  return expression.expand.simplify?.expr ?? expression.expand.expr
}

export async function factor(expr: string) {
  'use server'
  const { expression } = await request(
    graphql(`
      query Factor($expr: Math!) {
        expression(expr: $expr) {
          factor {
            expr
          }
        }
      }
    `),
    { expr },
  )
  return expression.factor.expr
}

export async function getFirstRoot(expr: string) {
  'use server'
  const { expression } = await request(
    graphql(`
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
    { expr },
  )
  return expression.solveset.index.expr
}

export async function normalizePolynomial(expr: string) {
  'use server'
  const { expression } = await request(
    graphql(`
      query NormalizePolynomial($expr: Math!) {
        expression(expr: $expr) {
          normalizeRoots {
            expr
          }
        }
      }
    `),
    { expr },
  )
  return expression.normalizeRoots.expr
}

export async function simplify(expr: string) {
  'use server'
  const { expression } = await request(
    graphql(`
      query Simplify($expr: Math!) {
        expression(expr: $expr) {
          simplify {
            expr
          }
        }
      }
    `),
    { expr },
  )
  return expression.simplify.expr
}
