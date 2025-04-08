import { NewableClass } from 'src/contexts/shared/domain/NewableClass'
import {
  Primitives,
  ValueObject
} from 'src/contexts/shared/domain/value-object/ValueObject'

export const ValueObjectTransformer = <T extends Primitives>(
  ValueObject: NewableClass<ValueObject<any>>
) => {
  return {
    to: (value: ValueObject<T>): T => value.value,
    from: (value: T): ValueObject<T> => new ValueObject(value)
  }
}
