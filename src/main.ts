import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { ConfigService } from '@nestjs/config'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true } // buffer logs for better integration with nestjs-pino
  )
  app.useLogger(app.get(Logger)) // use nestjs-pino logger

  const configService = app.get(ConfigService)
  const port = configService.get<string>('PORT', '3000')

  await app.listen(port, '0.0.0.0')

  const logger: Logger = app.get(Logger) // get the logger instance
  logger.log(`Server is running on http://localhost:${port}/`)
}

bootstrap().catch(handleError)

function handleError(error: Error) {
  console.error(error)
  process.exit(1)
}
