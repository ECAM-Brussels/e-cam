import pytest

from symapi import schema

@pytest.mark.parametrize(
    "expr,expected",
    [
        ("x^2", "2 x"),
        ("2^x", r"2^{x} \ln\left(2\right)"),
        ("\\log(x)", r"\frac{1}{x}"),
        ("\\log_2(x)", r"\frac{1}{x \ln\left(2\right)}"),
    ],
)
def test_diff(expr: str, expected: str):
    result = schema.execute_sync(
        """
            query ($expr: Math!) {
                expression(expr: $expr) {
                    diff {
                        expr
                    }
                }
            }
        """,
        variable_values={"expr": expr},
    )

    assert result.data is not None
    assert result.data["expression"]["diff"]["expr"] == expected


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
        ('1 + i', '\\sqrt{2} e^{i \\frac{\\pi}{4}}', True),
    ],
)
def test_is_equal(expr: str, attempt: str, expected: bool):
    result = schema.execute_sync(
        """
            query ($expr: Math!, $attempt: Math!) {
                expression(expr: $attempt) {
                    isEqual(expr: $expr, complex: true)
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
        ('\\frac {22} {7}', True),
        ('3 e^{i \\frac{\\pi} 4}', True),
        ('3 (\\cos \\frac{\\pi}{3} + i \\sin \\frac{\\pi}{3})', True),
        ('3 (\\cos \\frac{\\pi}{3} + i \\cos \\frac{\\pi}{3})', False),
        ('2 + 3i', False),
    ],
)
def test_is_polar(expr: str, expected: bool):
    result = schema.execute_sync(
        """
            query ($expr: Math!) {
                expression(expr: $expr) {
                    isPolar
                }
            }
        """,
        variable_values={"expr": expr},
    )
    assert result.data is not None
    assert result.data["expression"] == {
        "isPolar": expected,
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
        ('-x (x + 1)', True),
        ('x^2 - 14x + 49', False),
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
