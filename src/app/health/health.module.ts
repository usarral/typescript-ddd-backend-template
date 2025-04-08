import { Module } from '@nestjs/common'
import { HealthController } from './api/health.controller'

/**
 * Module for health check endpoints.
 * Provides system health monitoring capabilities.
 */
@Module({
  controllers: [HealthController]
})
export class HealthModule {}
