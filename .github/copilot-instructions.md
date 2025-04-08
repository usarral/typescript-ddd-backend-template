# Instrucciones para GitHub Copilot

## Arquitectura y Patrones

Este proyecto sigue una arquitectura de Domain-Driven Design (DDD) con las siguientes características:

- **Arquitectura Hexagonal/Ports and Adapters**: Separación clara entre dominio, aplicación e infraestructura.
- **CQRS (Command Query Responsibility Segregation)**: Uso de Command y Query buses para separar las operaciones.
- **Value Objects**: Encapsulación de conceptos de dominio en objetos inmutables.
- **Aggregate Roots**: Entidades principales que garantizan la consistencia del dominio.
- **Domain Events**: Eventos que se producen dentro del dominio y pueden ser consumidos por suscriptores.

## Estructura de Carpetas

- `/src/contexts`: Organización en contextos acotados (bounded contexts).
  - `/shared`: Componentes compartidos entre contextos.
    - `/domain`: Interfaces, entidades abstractas y value objects base.
    - `/infrastructure`: Implementaciones concretas de interfaces del dominio.
  - (Otros contextos específicos de dominio)
- `/src/app`: Configuración de la aplicación NestJS.

## Código

### Value Objects

- Usar ValueObject como clase base para todos los value objects.
- Implementar la validación en el constructor.
- Garantizar inmutabilidad.

```typescript
// Ejemplo de implementación:
export class MyValueObject extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureValidValue(value);
  }

  private ensureValidValue(value: string): void {
    // Lógica de validación específica
  }
}
```

### Entidades y Agregados

- Los Aggregate Roots deben extender de AgregateRoot.
- Deben implementar toPrimitives() para serialización.
- Usar el método record() para registrar eventos de dominio.

```typescript
// Ejemplo de implementación:
export class MyEntity extends AgregateRoot {
  constructor(
    private readonly id: Uuid,
    private name: EntityName,
    // Otros atributos
  ) {
    super();
  }

  // Factory method - patrón recomendado para creación
  static create(id: string, name: string): MyEntity {
    const entity = new MyEntity(
      new Uuid(id),
      new EntityName(name)
    );
    entity.record(new EntityCreatedDomainEvent(id));
    return entity;
  }

  toPrimitives(): any {
    return {
      id: this.id.value,
      name: this.name.value
    };
  }
}
```

### Commands y Queries

- Commands: Representan una intención de modificar el estado.
- Queries: Representan una intención de obtener información.
- Handlers: Procesan commands o queries específicos.

```typescript
// Ejemplo de Command:
export class CreateEntityCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string
  ) {}
}

// Ejemplo de Command Handler:
export class CreateEntityCommandHandler implements CommandHandler<CreateEntityCommand> {
  constructor(private repository: EntityRepository) {}

  async handle(command: CreateEntityCommand): Promise<void> {
    const entity = MyEntity.create(command.id, command.name);
    await this.repository.save(entity);
  }
}
```

### Repositorios

- Usar interfaces en el dominio y implementaciones en la infraestructura.
- Seguir el patrón Repository para acceso a datos.

```typescript
// Interfaz en el dominio:
export interface EntityRepository {
  save(entity: MyEntity): Promise<void>;
  findById(id: Uuid): Promise<MyEntity | null>;
}

// Implementación en infraestructura:
export class TypeOrmEntityRepository implements EntityRepository {
  // Implementación específica
}
```

## Tecnologías

- **Framework**: NestJS con Fastify como adaptador HTTP
- **Logs**: nestjs-pino para logging estructurado
- **Persistencia**: TypeORM para acceso a datos
- **Inyección de dependencias**: Uso de contenedor DI nativo de NestJS

## Buenas Prácticas

1. **Clean Code**:
   - Nombres descriptivos de variables y funciones
   - Funciones pequeñas con responsabilidad única
   - Evitar comentarios redundantes, el código debe ser autodocumentado

2. **SOLID**:
   - Single Responsibility Principle: Cada clase debe tener una única razón para cambiar
   - Open/Closed Principle: Abierto para extensión, cerrado para modificación
   - Liskov Substitution Principle: Las subclases deben poder sustituir a sus clases base
   - Interface Segregation Principle: Interfaces pequeñas y específicas
   - Dependency Inversion Principle: Depender de abstracciones, no de implementaciones

3. **Testing**:
   - Pruebas unitarias para el dominio
   - Pruebas de integración para la infraestructura
   - Uso de mocks/stubs para aislar dependencias

4. **Gestión de errores**:
   - Errores específicos de dominio
   - Control de excepciones en capas de aplicación
   - Logging adecuado

5. **Nomenclatura y Convenciones**:
   - CamelCase para variables y métodos
   - PascalCase para clases e interfaces
   - Nombres descriptivos y orientados al dominio
   - Sufijos claros: Repository, Command, Query, Event, etc.
   - El código y los comentarios deben estar en inglés aun que el proyecto sea en español

6. **Estructuras de datos**:
   - Preferir tipos inmutables y estructuras de datos primitivas cuando sea posible
   - Usar tipado fuerte para todos los objetos del dominio
   - Evitar tipos "any" excepto cuando sea absolutamente necesario
   - Utilizar genéricos para mejorar la reutilización de código

## Manejo de Domain Events

### Publicación de Eventos

- Los eventos de dominio se registran en los agregados mediante el método `record()`.
- Se extraen y publican a través del EventBus después de persistir los cambios.

```typescript
// Ejemplo de Domain Event:
export class UserCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'user.created';

  constructor(
    id: string,
    readonly email: string
  ) {
    super({
      eventName: UserCreatedDomainEvent.EVENT_NAME,
      aggregateId: id
    });
  }

  toPrimitives(): any {
    return {
      email: this.email
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    eventId: string;
    occurredOn: Date;
    attributes: any;
  }): DomainEvent {
    return new UserCreatedDomainEvent(
      params.aggregateId,
      params.attributes.email
    );
  }
}

// Uso en un caso de uso:
class CreateUserUseCase {
  constructor(
    private repository: UserRepository,
    private eventBus: EventBus
  ) {}

  async execute(id: string, email: string): Promise<void> {
    const user = User.create(id, email);
    await this.repository.save(user);
    await this.eventBus.publish(user.pullDomainEvents());
  }
}
```

### Suscripción a Eventos

- Crear clases que implementen la interfaz `DomainEventSubscriber`.
- Registrar los suscriptores en el EventBus.

```typescript
export class UserCreatedEmailSender implements DomainEventSubscriber<UserCreatedDomainEvent> {
  constructor(private emailSender: EmailSender) {}

  subscribedTo(): Array<DomainEventClass> {
    return [UserCreatedDomainEvent];
  }

  async on(domainEvent: UserCreatedDomainEvent): Promise<void> {
    await this.emailSender.send(
      domainEvent.email,
      'Welcome to our platform',
      'Thank you for registering...'
    );
  }
}
```

## Capas de Aplicación

Las capas de aplicación (application services o use cases) coordinan las operaciones entre el dominio y la infraestructura:

- **Casos de Uso**: Implementan la lógica de aplicación y orquestan entidades de dominio.
- **Application Services**: Proporcionan una API para que los controladores interactúen con el dominio.

```typescript
// Ejemplo de caso de uso:
export class FindUserQueryHandler implements QueryHandler<FindUserQuery, UserResponse> {
  constructor(private repository: UserRepository) {}

  subscribedTo(): Query {
    return FindUserQuery;
  }

  async handle(query: FindUserQuery): Promise<UserResponse> {
    const user = await this.repository.findById(new UserId(query.id));
    
    if (!user) {
      throw new UserNotFoundError(query.id);
    }
    
    return new UserResponse(user.id.value, user.name.value, user.email.value);
  }
}
```

## Criterios para la Creación de Bounded Contexts

- **Dominio de Negocio**: Agrupar por funcionalidades relacionadas al mismo subdominio.
- **Vocabulario**: Términos que tienen el mismo significado dentro del contexto.
- **Equipos**: Considerar los límites organizacionales.
- **Autonomía**: Cada contexto debe poder evolucionar independientemente.

## Patrones de Integración entre Contextos

- **Shared Kernel**: Código compartido entre contextos (con precaución).
- **Anti-corruption Layer**: Para aislar un contexto de otro y traducir conceptos.
- **Open Host Service**: API bien definidas para consumir servicios de otro contexto.
- **Published Language**: Formato común para el intercambio de datos.

## Gestión de Transacciones

- Transacciones limitadas a un solo agregado.
- Para operaciones que afectan a múltiples agregados, usar eventos de dominio.
- Implementar patrones de consistencia eventual cuando sea necesario.

```typescript
// Ejemplo de transacción en un repositorio:
export class TypeOrmUserRepository implements UserRepository {
  constructor(private dataSource: DataSource) {}

  async save(user: User): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Operaciones de persistencia
      await queryRunner.manager.save(UserEntity.fromDomain(user));
      
      // Publicar eventos si es necesario
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
```

## Documentación de API

- Utilizar decoradores de NestJS para documentar endpoints con Swagger/OpenAPI.
- Incluir descripciones claras de cada endpoint, parámetros y respuestas.
- Documentar los modelos de datos utilizados en la API.

```typescript
@ApiTags('users')
@Controller('users')
export class UserController {
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    // Implementación
  }
}
```

## CI/CD y Despliegue

- **Pipelines**: GitHub Actions para CI/CD.
- **Entornos**: Desarrollo, Producción.
- **Despliegue**: Contenedores Docker y orquestación con Docker Compose.
- **Monitoreo**: Pendiente por definir

## Criterios de Performance y Optimización

- Evitar N+1 queries utilizando eager loading o data loaders.
- Implementar cache en consultas frecuentes o costosas.
- Utilizar índices en la base de datos para optimizar búsquedas.
- Considerar la paginación para grandes conjuntos de datos.
- Monitorizar y optimizar tiempos de respuesta y uso de recursos.
