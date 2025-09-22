import chempy
import strawberry
from strawberry.scalars import JSON
import typing

from symapi.expression import Expression

Formula = strawberry.scalar(
    typing.NewType("Formula", chempy.Substance),
    serialize=lambda s: str(s),
    parse_value=lambda s: chempy.Substance.from_formula(s),
)


@strawberry.type
class Chemistry:
    @strawberry.field
    def substance(self, formula: Formula) -> "Substance":
        return Substance(formula=formula)

    @strawberry.field
    def equation(
        self, reactants: list[Formula], products: list[Formula]
    ) -> "ChemicalEquation":
        return ChemicalEquation(react=reactants, prod=products)


@strawberry.type
class Substance:
    formula: Formula = strawberry.field(description="Substance formula")
    coeff: float = 1

    @strawberry.field
    def mass(self) -> "Expression":
        return Expression(expr=self.formula.mass)

    @strawberry.field
    def latex(self) -> str:
        return self.formula.latex_name


@strawberry.type
class ChemicalEquation:
    react: list[Formula]
    prod: list[Formula]

    @property
    def balance(self):
        reactants = set([str(r) for r in self.react])
        products = set([str(r) for r in self.prod])
        return chempy.balance_stoichiometry(reactants, products)

    @strawberry.field
    def products(self) -> list[Substance]:
        prod = self.balance[1]
        return [
            Substance(formula=formula, coeff=prod[str(formula)])
            for formula in self.prod
        ]

    @strawberry.field
    def reactants(self) -> list[Substance]:
        react = self.balance[0]
        return [
            Substance(formula=formula, coeff=react[str(formula)])
            for formula in self.react
        ]
