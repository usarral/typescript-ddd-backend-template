import { test, expect } from '@playwright/test'

// Definir la interfaz para la respuesta del health check
interface HealthCheckResponse {
  status: string
  timestamp: string
  service: string
  version: string
}

test.describe('API Health Check', () => {
  test('should return health status', async ({ request }) => {
    // Suponiendo que hay un endpoint de health check
    const response = await request.get('/health')

    expect(response.status()).toBe(200)

    const body = (await response.json()) as HealthCheckResponse
    expect(body.status).toBe('ok')
  })

  // Ejemplo de test para verificar un error 404
  test('should return 404 for non-existent routes', async ({ request }) => {
    const response = await request.get('/non-existent-route')
    expect(response.status()).toBe(404)
  })
})
