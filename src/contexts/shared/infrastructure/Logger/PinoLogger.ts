import { Injectable } from '@nestjs/common'
import Logger from '../../domain/Logger'
import { Logger as PinoLoggerInstance } from 'nestjs-pino'

@Injectable()
export class PinoLogger implements Logger {
  constructor(private readonly logger: PinoLoggerInstance) {}

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug({ ...meta }, message)
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.log({ ...meta }, message)
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.logger.error({ ...meta }, message)
  }
}
