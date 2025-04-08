import { EnumValueObject } from '../value-object/EnumValueObject'
import { InvalidArgumentError } from '../value-object/InvalidArgumentError'

export enum Operator {
  EQUAL = '=',
  NOT_EQUAL = '!=',
  GT = '>',
  LT = '<',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS'
}

export class FilterOperator extends EnumValueObject<Operator> {
  constructor(value: Operator) {
    super(value, Object.values(Operator))
  }

  static fromValue(value: string): FilterOperator {
    const operatorValues = Object.values(Operator) as string[]
    const index = operatorValues.findIndex((op) => op === value)

    if (index !== -1) {
      return new FilterOperator(Object.values(Operator)[index])
    }

    throw new InvalidArgumentError(`The filter operator ${value} is invalid`)
  }

  static equal() {
    return this.fromValue(Operator.EQUAL)
  }

  public isPositive(): boolean {
    return (
      this.value !== Operator.NOT_EQUAL && this.value !== Operator.NOT_CONTAINS
    )
  }

  protected throwErrorForInvalidValue(value: Operator): void {
    throw new InvalidArgumentError(`The filter operator ${value} is invalid`)
  }
}
