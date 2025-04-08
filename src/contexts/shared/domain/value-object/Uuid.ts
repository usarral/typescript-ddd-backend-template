import validate from 'uuid-validate'
import { randomUUID as uuid } from 'node:crypto'
import { InvalidArgumentError } from './InvalidArgumentError'
import { ValueObject } from './ValueObject'

export class Uuid extends ValueObject<string> {
  constructor(value: string) {
    super(value)
    this.ensureIsValidUuid(value)
  }

  static random(): Uuid {
    return new Uuid(uuid())
  }

  private ensureIsValidUuid(id: string): void {
    if (!validate(id)) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${id}>`
      )
    }
  }
}
