# TypeScript DDD Backend Template

[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-E0234E?style=flat&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-11.0.12-000000?style=flat&logo=fastify)](https://fastify.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.15.0-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3.22-FE0902?style=flat)](https://typeorm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Description

This template implements a Domain-Driven Design (DDD) architecture using NestJS and TypeScript. It provides a solid foundation for developing scalable, maintainable, and high-quality backend applications following DDD principles.

## 🏗️ Project Structure

```
.
├── src/
│   ├── app/                  # NestJS application configuration
│   │   ├── health/           # Health endpoints
│   │   └── app.module.ts     # Main module
│   ├── contexts/             # Bounded Contexts
│   │   └── shared/           # Shared elements between contexts
│   └── main.ts               # Entry point
├── test/                     # e2e tests
├── .env.example              # Environment variables example
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🌐 DDD Architecture

The architecture follows Domain-Driven Design with:

- **Bounded Contexts**: Division of the domain into separate contexts
- **Hexagonal Layers**: Clear separation between:
  - Domain (Entities, Value Objects, Aggregates)
  - Application (Use Cases)
  - Infrastructure (Controllers, Repositories)
  - Interfaces (APIs)

## 🚀 Features

- 🧩 **Modular architecture**: Facilitates scalability and maintenance
- 🧪 **Testing**: Configuration for unit and e2e tests
- 🔄 **Dependency inversion**: Implemented with NestJS
- 📝 **Validation**: With integrated class-validator
- 🔐 **Configuration**: Environment-based configuration system
- 📊 **Logging**: Integrated system with pino
- 🔍 **Health**: Endpoints for service monitoring

## 🛠️ Technologies

- **NestJS**: Framework for scalable backend applications
- **TypeScript**: Static typing for JavaScript
- **Fastify**: High-performance HTTP server
- **MongoDB**: NoSQL database
- **TypeORM**: ORM for TypeScript and JavaScript
- **Jest**: Testing framework
- **ESLint/Prettier**: Formatting and linting tools

## 🏁 Quick Start

```bash
# Install dependencies
npm install
# or
pnpm install

# Configuration
cp .env.example .env
# Edit .env with your settings

# Development
npm run start:dev
# or
pnpm start:dev

# Production build
npm run build
# or
pnpm build

# Production execution
npm run start:prod
# or
pnpm start:prod
```

## 🧪 Testing

```bash
# Unit tests
npm run test
# or
pnpm test

# e2e tests
npm run test:e2e
# or
pnpm test:e2e

# Coverage
npm run test:cov
# or
pnpm test:cov
```

## 📚 Guide to Implement New Contexts

1. Create a new directory in `src/contexts/`
2. Implement DDD layers:
   - `domain/`: Entities, Value Objects, Domain Events
   - `application/`: Use Cases, DTOs
   - `infrastructure/`: Controllers, Repositories
   - `domain_services/`: Domain Services

## 📜 License

This project is licensed under the MIT License


---

⭐ Created to effectively implement DDD in TypeScript with NestJS.
