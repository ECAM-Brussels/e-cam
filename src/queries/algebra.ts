import { graphql } from '~/gql'
import { createFunction } from '~/lib/graphql'

export const checkFactorisation = createFunction(
  graphql(`
    query CheckFactorisation($expr: Math!, $attempt: Math!) {
      attempt: expression(expr: $attempt) {
        isEqual(expr: $expr)
        isFactored
      }
    }
  `),
  ({ attempt }) => attempt.isEqual && attempt.isFactored,
)

export const expand = createFunction(
  graphql(`
    query ExpandExpr($expr: Math!) {
      expression(expr: $expr) {
        expand {
          expr
        }
      }
    }
  `),
  (result) => result.expression.expand.expr,
)

export const factor = createFunction(
  graphql(`
    query Factor($expr: Math!) {
      expression(expr: $expr) {
        factor {
          expr
        }
      }
    }
  `),
  ({ expression }) => expression.factor.expr,
)

export const getFirstRoot = createFunction(
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
  (res) => res.expression.solveset.index.expr,
)

export const normalizePolynomial = createFunction(
  graphql(`
    query NormalizePolynomial($expr: Math!) {
      expression(expr: $expr) {
        normalizeRoots {
          expr
        }
      }
    }
  `),
  ({ expression }) => expression.normalizeRoots.expr,
)
