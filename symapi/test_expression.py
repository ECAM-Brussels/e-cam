import pytest

from symapi import schema


@pytest.mark.parametrize(
    "expr,attempt,expected",
    [
        ("x^2 - 5x + 6", "(x - 2)(x - 3)", True),
        ("i^2", "-1", True),
        ("e", "\\exp(1)", True),
        ("\\pi", "2*\\arcsin(1)", True),
    ],
)
def test_is_equal(expr: str, attempt: str, expected: bool):
    result = schema.execute_sync(
        """
            query ($expr: Math!, $attempt: Math!) {
                expression(expr: $attempt) {
                    isEqual(expr: $expr)
                }
            }
        """,
        variable_values={"expr": expr, "attempt": attempt},
    )

    assert result.data is not None
    assert result.data["expression"] == {
        "isEqual": expected,
    }


@pytest.mark.parametrize(
    "expr,expected",
    [
        ("x^2 - x", False),
        ("(x - 1)^2", True),
    ],
)
def test_is_factored(expr: str, expected: bool):
    result = schema.execute_sync(
        """
            query ($expr: Math!) {
                expression(expr: $expr) {
                    isFactored
                }
            }
        """,
        variable_values={"expr": expr},
    )

    assert result.data is not None
    assert result.data["expression"] == {
        "isFactored": expected,
    }
