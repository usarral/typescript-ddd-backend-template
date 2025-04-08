export class CommandNotRegisteredError extends Error {
  constructor(command: string) {
    super(
      `The command <${command.constructor.name}> hasn't a command handler associated`
    )
  }
}
