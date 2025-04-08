import { Controller, Get, HttpCode } from '@nestjs/common'
import { Logger } from 'nestjs-pino'

@Controller('health')
export class HealthController {
  constructor(private readonly logger: Logger) {}

  @Get()
  @HttpCode(200)
  run() {
    this.logger.log('Health check endpoint hit')
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'performsquad-backend',
      version: process.env.npm_package_version ?? 'unknown'
    }
  }
}
