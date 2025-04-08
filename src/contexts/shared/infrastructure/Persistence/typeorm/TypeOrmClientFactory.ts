import { DataSource } from 'typeorm'
import { TypeOrmConfig } from './TypeOrmConfig'
import { TypeOrmCreateClientException } from './TypeOrmCreateClientException'

export class TypeOrmClientFactory {
  private static readonly dataSources: Map<string, DataSource> = new Map()

  static async createClient(
    contextName: string,
    config: TypeOrmConfig
  ): Promise<DataSource> {
    try {
      if (this.dataSources.has(contextName)) {
        return this.dataSources.get(contextName)!
      }

      const dataSource = new DataSource({
        name: contextName,
        type: 'postgres',
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        entities: [
          __dirname +
            '/../../../../**/**/infrastructure/Persistence/typeorm/*{.js,.ts}'
        ],
        synchronize: false, // Enable this only in development for automatic schema generation
        logging: true
      })

      await dataSource.initialize()
      this.dataSources.set(contextName, dataSource)

      return dataSource
    } catch (error) {
      throw new TypeOrmCreateClientException(`Error creating client: ${error}`)
    }
  }
}
