import { Collection, MongoClient } from 'mongodb'
import { DomainEventDeserializer } from '../DomainEventDeserializer'
import { DomainEvent } from 'src/contexts/shared/domain/DomainEvent'
import { DomainEventJsonSerializer } from '../DomainEventJsonSerializer'

export class DomainEventFailoverPublisher {
  static readonly collectionName = 'DomainEvents'
  DOCUMENT_COLLECTION_LIMIT = 200

  constructor(
    private readonly client: Promise<MongoClient>,
    private deserializer?: DomainEventDeserializer
  ) {
  }

  setDeserializer(deserializer: DomainEventDeserializer): void {
    this.deserializer = deserializer
  }

  async publish(event: DomainEvent): Promise<void> {
    const collection = await this.collection()

    const eventSerialized = DomainEventJsonSerializer.serialize(event)
    const options = { upsert: true }
    const update = { $set: { eventId: event.eventId, event: eventSerialized } }
    await collection.updateOne({ eventId: event.eventId }, update, options)
  }

  async consume(): Promise<Array<DomainEvent>> {
    const collection = await this.collection()
    const documents = await collection
      .find()
      .limit(this.DOCUMENT_COLLECTION_LIMIT)
      .toArray()
    if (!this.deserializer) {
      throw new Error('Deserializer has not been set yet')
    }
    const events = await Promise.all(
      documents.map((document) =>
        this.deserializer!.deserialize(document.event)
      )
    )
    return events.filter(Boolean)
  }

  protected async collection(): Promise<Collection> {
    return (await this.client)
      .db()
      .collection(DomainEventFailoverPublisher.collectionName)
  }
}
