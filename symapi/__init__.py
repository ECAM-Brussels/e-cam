import fastapi
from fastapi.middleware.cors import CORSMiddleware
import strawberry
import strawberry.fastapi
import sympy
import typing

from symapi.conic_section import ConicSection
from symapi.core import Math, Interval
from symapi.expression import Expression
from symapi.system import System
from symapi.vector import Vector


@strawberry.type
class Query:

    @strawberry.field
    def conic_section(self, equation: Math) -> "ConicSection":
        return ConicSection(equation=equation)

    @strawberry.field(description="Analyze a mathematical expression")
    def expression(self, expr: Math) -> "Expression":
        return Expression(expr=expr)

    @strawberry.field
    def vector(self, coordinates: list[Math]) -> "Vector":
        return Vector(coordinates=coordinates)

    @strawberry.field(description="Systems")
    def system(self) -> "System":
        return System()

    @strawberry.field(description="Set")
    def set(self, intervals: typing.List[Interval]) -> "Expression":
        I = map(lambda i: sympy.Interval(i.a, i.b, i.left_open, i.right_open), intervals)
        return Expression(expr=sympy.Union(*I))


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
