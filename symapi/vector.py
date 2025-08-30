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
    def dot(self, coordinates: list[Math]) -> "Expression":
        a = sympy.Matrix(self.coordinates)
        b = sympy.Matrix(coordinates)
        return Expression(expr=a.dot(b))

    @strawberry.field
    def euler_rotate(self, phi: Math, theta: Math, psi: Math) -> "Vector":
        R_x = sympy.Matrix(
            [
                [1, 0, 0],
                [0, sympy.cos(phi), -sympy.sin(phi)],
                [0, sympy.sin(phi), sympy.cos(phi)],
            ]
        )
        R_y = sympy.Matrix(
            [
                [sympy.cos(theta), 0, sympy.sin(theta)],
                [0, 1, 0],
                [-sympy.sin(theta), 0, sympy.cos(theta)],
            ]
        )
        R_z = sympy.Matrix(
            [
                [sympy.cos(psi), -sympy.sin(psi), 0],
                [sympy.sin(psi), sympy.cos(psi), 0],
                [0, 0, 1],
            ]
        )
        rotated = R_z * R_y * R_x * sympy.Matrix(self.coordinates)
        return Vector(coordinates=list(rotated))

    @strawberry.field
    def expr(self) -> list["Expression"]:
        return [Expression(expr=c) for c in self.coordinates]

    @strawberry.field
    def is_equal(self, coordinates: list[Math]) -> bool:
        if len(self.coordinates) != len(coordinates):
            return False
        for x, y in zip(self.coordinates, coordinates):
            if sympy.simplify(sympy.expand_complex(x - y)) != 0:
                return False
        return True

    @strawberry.field
    def norm(self) -> "Expression":
        a = sympy.Matrix(self.coordinates)
        return sympy.sqrt(a.dot(a))

    @strawberry.field
    def permute(self, swaps: list[tuple[int, int]]) -> "Vector":
        coord = self.coordinates
        for [i, j] in swaps:
            coord[i], coord[j] = coord[j], coord[i]
        return Vector(coordinates=coord)
