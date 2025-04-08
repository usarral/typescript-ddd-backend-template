import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { HealthModule } from './health/health.module'

/**
 * Root module of the application.
 * Configures and bootstraps the application.
 */
@Module({
  imports: [
    HealthModule,

    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { colorize: true }
              }
            : undefined
      }
    })
  ]
})
export class AppModule {}
