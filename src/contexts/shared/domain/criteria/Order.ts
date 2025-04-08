import { OrderBy } from './OrderBy'
import { OrderType, OrderTypes } from './OrderType'

export class Order {
  readonly orderBy: OrderBy
  readonly orderType: OrderType

  constructor(orderBy: OrderBy, order: OrderType) {
    this.orderBy = orderBy
    this.orderType = order
  }

  static fromValues(orderBy?: string, orderType?: string): Order {
    if (!orderBy) {
      return Order.none()
    }
    return new Order(
      new OrderBy(orderBy),
      OrderType.fromValue(orderType ?? OrderTypes.NONE)
    )
  }

  static none(): Order {
    return new Order(new OrderBy(''), new OrderType(OrderTypes.NONE))
  }

  static asc(orderBy: string): Order {
    return new Order(new OrderBy(orderBy), new OrderType(OrderTypes.ASC))
  }

  static desc(orderBy: string): Order {
    return new Order(new OrderBy(orderBy), new OrderType(OrderTypes.DESC))
  }

  public hasOrder() {
    return !this.orderType.isNone()
  }
}
