import { Query } from '../../domain/Query'
import { QueryHandler } from '../../domain/QueryHandler'
import { QueryResponse } from '../../domain/QueryResponse'
import { QueryNotRegisteredError } from '../../domain/QueryNotRegisteredError'

export class QueryHandlers extends Map<
  Query,
  QueryHandler<Query, QueryResponse>
> {
  constructor(queryHandlers: Array<QueryHandler<Query, QueryResponse>>) {
    super()
    queryHandlers.forEach((queryHandler) => {
      this.set(queryHandler.subscribedTo(), queryHandler)
    })
  }

  public get(query: Query): QueryHandler<Query, QueryResponse> {
    const queryHandler = super.get(query.constructor)

    if (!queryHandler) {
      throw new QueryNotRegisteredError(query)
    }

    return queryHandler
  }
}
