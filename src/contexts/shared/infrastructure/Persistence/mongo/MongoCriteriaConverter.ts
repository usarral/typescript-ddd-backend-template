import { Criteria } from 'src/contexts/shared/domain/criteria/Criteria'
import { Filter } from 'src/contexts/shared/domain/criteria/Filter'
import { Operator } from 'src/contexts/shared/domain/criteria/FilterOperator'
import { Filters } from 'src/contexts/shared/domain/criteria/Filters'
import { Order } from 'src/contexts/shared/domain/criteria/Order'

type MongoFilterOperator = '$eq' | '$ne' | '$gt' | '$lt' | '$regex'
type MongoFilterValue = boolean | string | number
type MongoFilterOperation = {
  [operator in MongoFilterOperator]?: MongoFilterValue
}
type MongoFilter =
  | { [field: string]: MongoFilterOperation }
  | { [field: string]: { $not: MongoFilterOperation } }
type MongoDirection = 1 | -1
type MongoSort = { [type: string]: MongoDirection }

interface MongoQuery {
  filter: MongoFilter
  sort: MongoSort
  skip: number
  limit: number
}

type TransformerFunction<T, K> = (value: T) => K

export class MongoCriteriaConverter {
  private readonly filterTransformers: Map<
    Operator,
    TransformerFunction<Filter, MongoFilter>
  >

  constructor() {
    this.filterTransformers = new Map<
      Operator,
      TransformerFunction<Filter, MongoFilter>
    >([
      [Operator.EQUAL, (filter: Filter) => this.equalFilter(filter)],
      [Operator.NOT_EQUAL, (filter: Filter) => this.notEqualFilter(filter)],
      [Operator.GT, (filter: Filter) => this.greaterThanFilter(filter)],
      [Operator.LT, (filter: Filter) => this.lowerThanFilter(filter)],
      [Operator.CONTAINS, (filter: Filter) => this.containsFilter(filter)],
      [
        Operator.NOT_CONTAINS,
        (filter: Filter) => this.notContainsFilter(filter)
      ]
    ])
  }

  public convert(criteria: Criteria): MongoQuery {
    return {
      filter: criteria.hasFilters()
        ? this.generateFilter(criteria.filters)
        : {},
      sort: criteria.order.hasOrder() ? this.generateSort(criteria.order) : {},
      skip: criteria.offset ?? 0,
      limit: criteria.limit ?? 0
    }
  }

  protected generateFilter(filters: Filters): MongoFilter {
    const filter = filters.filters.map((filter) => {
      const transformer = this.filterTransformers.get(filter.operator.value)
      if (!transformer) {
        throw new Error(`Unsupported operator: ${filter.operator.value}`)
      }
      return transformer(filter)
    })
    return Object.assign({}, ...filter) as MongoFilter
  }

  protected generateSort(order: Order): MongoSort {
    return {
      [order.orderBy.value === 'id' ? '_id' : order.orderBy.value]:
        order.orderType.isAsc() ? 1 : -1
    }
  }

  private equalFilter(filter: Filter): MongoFilter {
    return { [filter.field.value]: { $eq: filter.value.value } }
  }

  private notEqualFilter(filter: Filter): MongoFilter {
    return { [filter.field.value]: { $ne: filter.value.value } }
  }

  private greaterThanFilter(filter: Filter): MongoFilter {
    return { [filter.field.value]: { $gt: filter.value.value } }
  }

  private lowerThanFilter(filter: Filter): MongoFilter {
    return { [filter.field.value]: { $lt: filter.value.value } }
  }

  private containsFilter(filter: Filter): MongoFilter {
    return { [filter.field.value]: { $regex: filter.value.value } }
  }

  private notContainsFilter(filter: Filter): MongoFilter {
    return {
      [filter.field.value]: { $not: { $regex: filter.value.value } }
    }
  }
}
