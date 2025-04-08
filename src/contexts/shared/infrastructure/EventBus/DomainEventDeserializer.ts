import { DomainEvent, DomainEventClass } from '../../domain/DomainEvent'
import { DomainEventSubscribers } from './DomainEventSubscribers'

type DomainEventJSON = {
  type: string
  aggregateId: string
  attributes: string
  id: string
  occurredOn: string
}

export class DomainEventDeserializer extends Map<string, DomainEventClass> {
  static configure(subscribers: DomainEventSubscribers): DomainEventDeserializer {
    const mapping = new DomainEventDeserializer()
    subscribers.items.forEach((subscriber) => {
      subscriber.subscribedTo().forEach(mapping.registerEvent.bind(mapping))
    })
    return mapping
  }

  deserialize(event: string): Promise<DomainEvent> {
    const eventData = JSON.parse(event).data as DomainEventJSON
    const { type, aggregateId, attributes, id, occurredOn } = eventData
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
