import fastapi
import strawberry
import strawberry.fastapi

from symapi.core import Math
from symapi.expression import Expression


@strawberry.type
class Query:
    @strawberry.field(description="Analyze a mathematical expression")
    def expression(self, expr: Math) -> "Expression":
        return Expression(expr=expr)


schema = strawberry.Schema(Query)
graphql = strawberry.fastapi.GraphQLRouter(schema)
app = fastapi.FastAPI()
app.include_router(graphql, prefix="/graphql")
