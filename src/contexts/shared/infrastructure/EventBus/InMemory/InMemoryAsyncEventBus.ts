import { EventEmitter } from 'events'
import { DomainEvent } from 'src/contexts/shared/domain/DomainEvent'
import { EventBus } from 'src/contexts/shared/domain/EventBus'
import { DomainEventSubscribers } from 'src/contexts/shared/infrastructure/EventBus/DomainEventSubscribers'

export class InMemoryAsyncEventBus extends EventEmitter implements EventBus {
  publish(events: DomainEvent[]): Promise<void> {
    events.forEach((event) => this.emit(event.eventName, event))
    return Promise.resolve()
  }

  addSubscribers(subscribers: DomainEventSubscribers): void {
    subscribers.items.forEach((subscriber) => {
      subscriber.subscribedTo().forEach((event) => {
        this.on(event.EVENT_NAME, subscriber.on.bind(subscriber))
      })
    })
  }
}
