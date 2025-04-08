import { Command } from '../../domain/Command'
import { CommandHandler } from '../../domain/CommandHandler'
import { CommandNotRegisteredError } from '../../domain/CommandNotRegisteredError'

export class CommandHandlers extends Map<Command, CommandHandler<Command>> {
  constructor(commandHandlers: Array<CommandHandler<Command>>) {
    super()

    commandHandlers.forEach((commandHandler) => {
      this.set(commandHandler.subscribedTo(), commandHandler)
    })
  }

  public get(command: Command): CommandHandler<Command> {
    const commandHandler = super.get(command.constructor)
    if (!commandHandler) {
      throw new CommandNotRegisteredError(
        `Command handler not found for command: ${command.constructor.name}`
      )
    }
    return commandHandler
  }
}
