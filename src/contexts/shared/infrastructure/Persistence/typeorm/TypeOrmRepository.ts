import { AgregateRoot } from 'src/contexts/shared/domain/AgregateRoot'
import { DataSource, EntitySchema, Repository } from 'typeorm'

export abstract class TypeOrmRepository<T extends AgregateRoot> {
  protected constructor(private readonly _dataSource: Promise<DataSource>) {}

  protected abstract entitySchema(): EntitySchema<T>

  protected DataSource(): Promise<DataSource> {
    return this._dataSource
  }

  protected async repository(): Promise<Repository<T>> {
    return (await this._dataSource).getRepository(this.entitySchema())
  }

  protected async persist(aggregateRoot: T): Promise<void> {
    const repository = await this.repository()
    await repository.save(aggregateRoot as any)
  }
}
