import { graphql } from '~/gql'
import { request } from '~/lib/graphql'

export async function checkEqual(expr1: string, expr2: string, error: number = 0) {
  const { expression } = await request(
    graphql(`
      query EqualityCheck($expr1: Math!, $expr2: Math!, $error: Float!, $approximately: Boolean!) {
        expression(expr: $expr1) {
          isApproximatelyEqual(expr: $expr2, error: $error) @include(if: $approximately)
          isEqual(expr: $expr2) @skip(if: $approximately)
        }
      }
    `),
    { expr1, expr2, error, approximately: error !== 0 },
  )
  return (expression.isEqual ?? expression.isApproximatelyEqual) as boolean
}

export async function checkFactorisation(attempt: string, expr: string) {
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

export async function expand(expr: string) {
  const { expression } = await request(
    graphql(`
      query ExpandExpr($expr: Math!) {
        expression(expr: $expr) {
          expand {
            expr
          }
        }
      }
    `),
    { expr },
  )
  return expression.expand.expr
}

export async function factor(expr: string) {
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
