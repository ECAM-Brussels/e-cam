import chempy
import strawberry

from symapi.expression import Expression


@strawberry.type
class Chemistry:
    @strawberry.field
    def substance(self, formula: str) -> "Substance":
        return Substance(formula=formula)


@strawberry.type
class Substance:
    formula: str = strawberry.field(description="Substance formula")

    @property
    def substance(self):
        return chempy.Substance.from_formula(self.formula)

    @strawberry.field
    def mass(self) -> "Expression":
        return Expression(expr=self.substance.mass)

    @strawberry.field
    def latex(self) -> "str":
        return self.substance.latex_name
