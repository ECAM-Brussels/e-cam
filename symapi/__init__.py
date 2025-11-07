import fastapi
from fastapi.middleware.cors import CORSMiddleware
import os
import strawberry
import strawberry.fastapi
import sympy
from typing import Optional

from symapi.chemistry import Chemistry
from symapi.conic_section import ConicSection
from symapi.core import Math, MathSet
from symapi.expression import Expression
from symapi.system import System
from symapi.vector import Vector


@strawberry.type
class Query:

    @strawberry.field
    def chemistry(self) -> "Chemistry":
        return Chemistry()

    @strawberry.field
    def conic_section(self, equation: Math) -> "ConicSection":
        return ConicSection(equation=equation)

    @strawberry.field(description="Analyze a mathematical expression")
    def expression(self, expr: Math) -> "Expression":
        return Expression(expr=expr)

    @strawberry.field
    def matrix(self, entries: list[list[Math]]) -> "Expression":
        return Expression(expr=sympy.Matrix(entries))

    @strawberry.field
    def vector(self, coordinates: list[Math]) -> "Vector":
        return Vector(coordinates=coordinates)

    @strawberry.field(description="Systems")
    def system(self) -> "System":
        return System()

    @strawberry.field(description="Set")
    def set(self, expr: MathSet) -> "Expression":
        return Expression(expr=expr)

    @strawberry.field
    def interpolate(
        self,
        points: list[tuple[Math, Math]],
        line: Optional[Math] = None,
        perpendicular: Optional[bool] = False,
        x: Math = sympy.Symbol("x"),
        y: Math = sympy.Symbol("y"),
    ) -> "Expression":
        if line is not None:
            m = sympy.solve(line, y)[0].coeff(x)
            if perpendicular:
                if m == 0:
                    eq = sympy.Eq(x, points[0][0])
                    return Expression(expr=eq)
                else:
                    m = -1 / m
            x0, y0 = points[0]
            eq = sympy.Eq(y, m * (x - x0) + y0)
        else:
            data = {x: y for (x, y) in points}
            eq = sympy.Eq(y, sympy.interpolate(data, x))
        return Expression(expr=eq)


schema = strawberry.Schema(Query)
graphql = strawberry.fastapi.GraphQLRouter(schema)
app = fastapi.FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(graphql, prefix="/graphql")


@app.head("/health")
async def health_check():
    return {"status": "ok"}


@app.on_event("startup")
async def generate_schema():
    path = "./symapi/generated/schema.graphql"
    with open(path, "w") as f:
        f.write(str(schema))
    print(f"GraphQL schema generated at {path}")
