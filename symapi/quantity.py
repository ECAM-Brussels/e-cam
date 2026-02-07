import sympy
import strawberry
from symapi.core import Math, Unit, MY_UNITS, BASE_SI
from sympy.physics.units import convert_to


@strawberry.type
class Quantity:
    value: Math
    unit: Unit

    @strawberry.field
    def expression(self) -> Math:

        u_obj = sympy.sympify(str(self.unit).replace("^", "**"), locals=MY_UNITS)
        res_si = convert_to(self.value * u_obj, BASE_SI).simplify()
        return Math(res_si)

    @strawberry.field
    def test_expression(self) -> str:

        u_obj = sympy.sympify(str(self.unit).replace("^", "**"), locals=MY_UNITS)
        res_si = convert_to(self.value * u_obj, BASE_SI).simplify()

        res_str = str(res_si).replace(" ", "")

        return res_str.replace("**1", "")

    # complex unities : X*X/(Y*x) to avoid conflicts
    @strawberry.field
    def is_equal(self, value: Math, unit: Unit) -> bool:
        try:
            u1_obj = sympy.sympify(
                str(self.unit).replace("^", "**"), locals=MY_UNITS, evaluate=False
            )
            u2_obj = sympy.sympify(
                str(unit).replace("^", "**"), locals=MY_UNITS, evaluate=False
            )

            q1_si = convert_to(self.value * u1_obj, BASE_SI)
            q2_si = convert_to(value * u2_obj, BASE_SI)
            diff = float(sympy.N(q1_si - q2_si))

            if abs(diff) < 1e-4:  # ok if the quantities are exactly equal
                return True
            else:
                return False

        except Exception:
            return False
