import pytest
from symapi import schema


@pytest.mark.parametrize(
    "value,unit,expected",
    [
        ("1", "km", "1000*meter"),
        ("2", "m", "2*meter"),
        ("22", "g/cm**3", "22000*kilogram/meter**3"),
        ("1", "h", "3600*second"),
    ],
)
def test_SI(value, unit, expected):
    result = schema.execute_sync(
        """
        query($value: Math!, $unit: Unit!) {
            quantity(value: $value, unit: $unit) {
                testExpression  
            }
        }
        """,
        variable_values={"value": value, "unit": unit},
    )
    assert result.errors is None

    assert str(result.data["quantity"]["testExpression"]) == expected


@pytest.mark.parametrize(
    "value1,unit1,value2,unit2,expected",
    [
        ("1000", "mm", "1", "m", True),
        ("3", "kg/m**3", "30", "g/L", False),
        ("3", "kN", "3000", "kg * m/ s**2", True),
        ("1", "m", "2", "m", False),
        ("1000", "mm*kg", "1", "m*kg", True),
        ("1", "s", "1000", "ms", True),
    ],
)
def test_is_equal(value1, unit1, value2, unit2, expected):
    result = schema.execute_sync(
        """
        query($value1: Math!, $unit1: Unit!, $value2: Math!, $unit2: Unit!) {
            quantity(value: $value1, unit: $unit1) {
                isEqual(value: $value2, unit: $unit2)
                
            }
        }
        """,
        variable_values={
            "value1": value1,
            "unit1": unit1,
            "value2": value2,
            "unit2": unit2,
        },
    )

    if result.errors:
        print(f"Erreurs GraphQL: {result.errors}")

    assert result.errors is None
    assert result.data is not None
    assert result.data["quantity"]["isEqual"] == expected
