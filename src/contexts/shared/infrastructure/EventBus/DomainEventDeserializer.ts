import { DomainEvent, DomainEventClass } from '../../domain/DomainEvent'
import { DomainEventSubscribers } from './DomainEventSubscribers'
import { DomainEventSubscriber } from '../../domain/DomainEventSubscriber'

type DomainEventJSON = {
  type: string
  aggregateId: string
  attributes: string
  id: string
  occurredOn: string
}

interface EventData {
  data: DomainEventJSON
}

export class DomainEventDeserializer extends Map<string, DomainEventClass> {
  static configure(
    subscribers: DomainEventSubscribers
  ): DomainEventDeserializer {
    const mapping = new DomainEventDeserializer()
    subscribers.items.forEach(
      (subscriber: DomainEventSubscriber<DomainEvent>) => {
        const registerFn = mapping.registerEvent.bind(mapping) as (
          event: DomainEventClass
        ) => void
        subscriber.subscribedTo().forEach(registerFn)
      }
    )
    return mapping
  }

  deserialize(event: string): Promise<DomainEvent> {
    const eventData = JSON.parse(event) as EventData
    const { type, aggregateId, attributes, id, occurredOn } = eventData.data
    const eventClass = super.get(type)
    if (!eventClass) {
      throw new Error(`DomainEvent mapping not found for event: ${type}`)
    }
    return Promise.resolve(
      eventClass.fromPrimitives({
        aggregateId,
        attributes,
        occurredOn: new Date(occurredOn),
        eventId: id
      })
    )
  }

  private registerEvent(domainEvent: DomainEventClass) {
    const eventName = domainEvent.EVENT_NAME
    this.set(eventName, domainEvent)
  }
}
