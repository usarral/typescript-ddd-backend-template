import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { MongoClient } from 'mongodb'

describe('MongoDB Connection Integration Test', () => {
  let client: MongoClient

  beforeAll(async () => {
    // Usar una URL de MongoDB para test (preferiblemente un contenedor temporal o una BD de test)
    const mongoUrl = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/test'
    client = new MongoClient(mongoUrl)
    await client.connect()
  })

  afterAll(async () => {
    if (client) {
      await client.close()
    }
  })

  it('should connect to MongoDB successfully', async () => {
    // Verificar que podemos realizar una operación simple
    const db = client.db()
    const admin = db.admin()
    const result = await admin.ping()
    expect(result.ok).toBe(1)
  })

  it('should be able to perform basic operations', async () => {
    const db = client.db()
    const collection = db.collection('test_collection')

    // Limpiar la colección antes de la prueba
    await collection.deleteMany({})

    // Insertar un documento
    const insertResult = await collection.insertOne({
      test: true,
      createdAt: new Date()
    })

    expect(insertResult.acknowledged).toBe(true)

    // Verificar que el documento existe
    const foundDocument = await collection.findOne({ test: true })
    expect(foundDocument).toBeDefined()
    expect(foundDocument?.test).toBe(true)
  })
})
