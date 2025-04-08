import { Query } from '../../domain/Query'
import { QueryResponse } from '../../domain/QueryResponse'
import { QueryBus } from '../../domain/QueryBus'
import { QueryHandlers } from './QueryHandlers'

export class InMemoryQueryBus implements QueryBus {
  constructor(private readonly queryHandlersInformation: QueryHandlers) {
  }

  async ask<R extends QueryResponse>(query: Query): Promise<R> {
    const handler = this.queryHandlersInformation.get(query)
    return (await handler.handle(query)) as Promise<R>
  }
}
