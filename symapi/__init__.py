import fastapi
import strawberry
import strawberry.fastapi

from symapi.conic_section import ConicSection
from symapi.core import Math
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


schema = strawberry.Schema(Query)
graphql = strawberry.fastapi.GraphQLRouter(schema)
app = fastapi.FastAPI()
app.include_router(graphql, prefix="/graphql")
