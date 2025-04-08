# Testing in PerformSquad Backend

This project uses Vitest for unit and integration tests, and Playwright for end-to-end tests.

## Folder Structure

```
test/
├── unit/          # Unit tests
├── integration/   # Integration tests
└── e2e/           # End-to-end tests with Playwright
```

## Running Tests

### Unit and Integration Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with visual UI
npm run test:ui

# Run with coverage
npm run test:cov
```

### End-to-End Tests

```bash
# Run e2e tests
npm run test:e2e

# Run with visual UI
npm run test:e2e:ui
```

## Configuration

- `vitest.config.ts`: Configuration for Vitest (unit and integration tests)
- `playwright.config.ts`: Configuration for Playwright (e2e tests)

## Naming Conventions

- Unit and integration tests: `*.test.ts`
- E2E tests: `*.spec.ts`

## Examples

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest'

describe('Example', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2)
  })
})
```

### Integration Test Example

```typescript
import { describe, it, beforeAll, afterAll } from 'vitest'
import { MongoClient } from 'mongodb'

describe('MongoDB Integration', () => {
  let client: MongoClient
  
  beforeAll(async () => {
    // Setup
  })
  
  afterAll(async () => {
    // Teardown
  })
  
  it('should connect to the database', async () => {
    // Test
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test('should load the API', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.status()).toBe(200)
})
``` 