import strawberry
import sympy

from symapi.core import Math
from symapi.expression import Expression


@strawberry.type
class Vector:
    coordinates: list[Math]

    @strawberry.field
    def angle(self, coordinates: list[Math], degrees: bool = False) -> "Expression":
        a = sympy.Matrix(self.coordinates)
        b = sympy.Matrix(coordinates)
        if a.dot(a) * b.dot(b) == 0:
            raise ValueError("Input vectors should have non-zero norms")
        theta = sympy.acos(a.dot(b) / sympy.sqrt(a.dot(a) * b.dot(b)))
        if degrees:
            theta = theta * 180 / sympy.pi
        return Expression(expr=theta)

    @strawberry.field
    def cross(self, coordinates: list[Math]) -> "Vector":
        a = sympy.Matrix(self.coordinates)
        b = sympy.Matrix(coordinates)
        return Vector(coordinates=list(a.cross(b)))
    
    @strawberry.field
    def is_equal(self, coordinates: list[Math]) -> bool:
        if len(self.coordinates) != len(coordinates):
            return False
        for x, y in zip(self.coordinates, coordinates):
            if sympy.simplify(sympy.expand_complex(x - y)) != 0:
                return False
        return True