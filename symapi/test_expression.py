import pytest

from symapi import schema


@pytest.mark.parametrize(
    "expr,expected",
    [
        ("(x - 2)(x - 3)", "x^{2} - 5 x + 6"),
        ("(x - i)(x + i)", "x^{2} + 1"),
    ],
)
def test_expand(expr: str, expected: str):
    result = schema.execute_sync(
        """
            query ($expr: Math!) {
                expression(expr: $expr) {
                    expand {
                        expr
                    }
                }
            }
        """,
        variable_values={"expr": expr},
    )

    assert result.data is not None
    assert result.data["expression"]["expand"]["expr"] == expected


@pytest.mark.parametrize(
    "expr,attempt,expected",
    [
        ("x^2 - 5x + 6", "(x - 2)(x - 3)", True),
        ("i^2", "-1", True),
        ("e", "\\exp(1)", True),
        ("\\pi", "2*\\arcsin(1)", True),
        ("x^2 - 4x", "x(x - 4)", True),
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
        ("2x + 1", True),
        ("2x + 2", False),
        ("(2x + 4)(x + 1)", False),
        ("x^2 + 1", True),
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
