# Cachalot CRM Contacts API

API REST diseñada con Node.js, NestJS y TypeScript para la gestión de contactos de clientes y notas para un CRM, respaldada por PostgreSQL y orquestada con Docker Compose.

---

## Arquitectura y Decisiones de Diseño

El proyecto implementa una arquitectura en capas limpia, desacoplada y predecible:

1. **Controladores (`Controllers`)**: Manejan las solicitudes HTTP, validación inicial de parámetros, versionamiento (`/api/v1`) y documentación OpenAPI/Swagger.
2. **Servicios (`Services`)**: Orquestan la lógica de negocio, reglas del dominio (como unicidad de correos electrónicos) y validación de entidades.
3. **Capa Mapper (`Mappers`)**: Aísla las entidades de base de datos de los contratos públicos (DTOs), transformando `CreateContactDto` / `UpdateContactDto` a entidades y entidades a `ContactResponseDto` / `NoteResponseDto`.
4. **Capa de Acceso a Datos (`DAO`)**: Encapsula las operaciones de persistencia, búsquedas con operadores `ILIKE` y borrado lógico (*Soft Delete*).
5. **Observabilidad (`@nestjs/observe`)**: Instrumentación de observabilidad distribuida y métricas de desempeño integrada.

---

## Contenedorización e Infraestructura con Docker

### ¿Por qué se utilizó Docker?

El uso de Docker en este proyecto responde a los siguientes objetivos de ingeniería de software:

- **Reproducibilidad y consistencia de entorno**: Elimina el problema de "en mi máquina funciona", garantizando que la aplicación, la base de datos PostgreSQL y el proxy inverso Nginx se ejecuten exactamente igual en desarrollo local, entornos de prueba y producción, independientemente del sistema operativo anfitrión.
- **Aislamiento de dependencias**: La base de datos, el entorno de ejecución Node.js y el servidor web Nginx se ejecutan en entornos aislados con sus propias versiones, sin requerir instalaciones previas ni generar conflictos con paquetes locales de la máquina host.
- **Facilidad de despliegue y puesta en marcha (*One-Command Setup*)**: Cualquier desarrollador o evaluador puede clonar el repositorio y levantar la infraestructura completa lista para producción con un solo comando (`docker compose up -d`), incluyendo la inicialización de tablas, índices y semillas de datos.
- **Escalabilidad horizontal**: Permite escalar dinámicamente el número de instancias de la API mediante balanceo de carga sin modificar el código fuente.

---

### ¿Qué hace el Dockerfile?

El archivo `Dockerfile` define la construcción de la imagen de la API de NestJS mediante un patrón de **construcción multi-etapa (*Multi-Stage Build*)** basado en `node:22-alpine` para optimizar el rendimiento, la seguridad y el tamaño de la imagen final:

1. **Etapa 1 (Builder)**:
   - Copia los manifiestos de dependencias (`package*.json`) y ejecuta `npm ci` para instalar todas las dependencias necesarias.
   - Copia el código fuente completo y compila la aplicación a JavaScript nativo mediante `npm run build` en el directorio `dist/`.

2. **Etapa 2 (Production)**:
   - Crea una imagen limpia y liviana basada en Alpine Linux.
   - Instala únicamente las dependencias de producción (`npm ci --omit=dev`), reduciendo drásticamente la superficie de ataque y el peso de la imagen.
   - Copia exclusivamente los artefactos compilados (`dist/`) desde la etapa anterior.
   - Aplica el **principio de mínimo privilegio**, ejecutando el proceso bajo el usuario sin privilegios `node` en lugar de `root`.
   - Expone el puerto `3000` y define el comando de inicio `node dist/main.js`.

---

### ¿Qué hace el Docker Compose (`docker-compose.yml`)?

El archivo `docker-compose.yml` actúa como el orquestador de los múltiples servicios interconectados a través de una red privada (`backend`):

1. **Servicio `postgres` (Base de Datos)**:
   - Levanta PostgreSQL 15 sobre Alpine Linux.
   - Persiste la información en un volumen de datos nombrado (`pgdata`).
   - Monta automáticamente el script `docker/init.sql` en el directorio de inicialización `/docker-entrypoint-initdb.d/` para crear las tablas, restricciones de unicidad, índices y datos iniciales en el primer arranque.
   - Implementa un mecanismo de verificación de salud (*Healthcheck*) con `pg_isready` para asegurar que la base de datos esté lista antes de aceptar conexiones.

2. **Servicio `api` (Backend NestJS)**:
   - Construye la imagen a partir del `Dockerfile` o utiliza la imagen preconstruida.
   - Se vincula al servicio `postgres` con `depends_on: { condition: service_healthy }`, evitando que la API intente arrancar antes de que la base de datos esté totalmente operativa.
   - Permite escalar horizontalmente las réplicas mediante la variable `API_REPLICAS` (por defecto 2 instancias).

3. **Servicio `nginx` (Proxy Reverso y Balanceador de Carga)**:
   - Actúa como puerta de entrada (*Gateway*) en el puerto HTTP `80`.
   - Utiliza el DNS interno de Docker (`127.0.0.11`) para balancear la carga de solicitudes HTTP entre todas las réplicas activas del servicio `api`.
   - Inyecta cabeceras estándar de proxy (`Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`) y maneja timeouts y tamaños máximos de solicitud.

---

## Requisitos Previos

- **Node.js**: v20 o superior (solo para desarrollo local sin Docker)
- **Docker** y **Docker Compose**

---

## Puesta en Marcha

### 1. Variables de Entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

El archivo `.env` viene preconfigurado con los valores estándar para desarrollo y contenedores:
- `HTTP_PORT=80` (puerto expuesto por Nginx)
- `DB_PORT=5432`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=postgres`
- `DB_NAME=cachalot_db`
- `DB_SYNCHRONIZE=true`
- `API_REPLICAS=2`

---

### 2. Levantar con Docker Compose (Recomendado)

Inicia PostgreSQL (con script de inicialización e índices automáticos), la API y el balanceador de carga Nginx en segundo plano:

```bash
docker compose up -d
```

Verifica el estado de los servicios:
```bash
docker compose ps
```

Acceso al servicio:
- **API Base**: `http://localhost/api/v1`
- **Documentación Interactiva Swagger**: `http://localhost/api/docs`

---

### 3. Ejecución en Desarrollo Local (Alternativa)

Si deseas ejecutar la base de datos en Docker y la API directamente en tu máquina local:

```bash
# 1. Iniciar solo PostgreSQL
docker compose up -d postgres

# 2. Instalar dependencias
npm install

# 3. Iniciar la API en modo desarrollo
npm run start:dev
```

La API estará disponible en `http://localhost:3000/api/v1` y la documentación en `http://localhost:3000/api/docs`.

---

## Documentación Interactiva (Swagger / OpenAPI)

Toda la API se encuentra documentada e interactiva a través de **Swagger UI** en:
- `http://localhost/api/docs` (o `http://localhost:3000/api/docs` en desarrollo local).

---

## Pruebas Automatizadas

El proyecto utiliza **Vitest** para pruebas unitarias de alta velocidad y cobertura:

```bash
# Ejecutar todas las pruebas unitarias
npm run test

# Ejecutar pruebas en modo observador (watch)
npm run test:watch

# Ejecutar pruebas con reporte de cobertura
npm run test:cov

# Ejecutar linter
npm run lint
```

---

## Endpoints Principales (`/api/v1`)

### 1. Contactos (`/api/v1/contacts`)

- `POST /api/v1/contacts`: Crea un nuevo contacto validando unicidad de `email` (`201 Created` / `409 Conflict`).
- `GET /api/v1/contacts`: Lista los contactos activos con filtros opcionales (`?name=...&company=...`).
- `GET /api/v1/contacts/:id`: Obtiene el detalle de un contacto con sus notas asociadas.
- `PATCH /api/v1/contacts/:id`: Actualiza parcialmente los datos de un contacto.
- `DELETE /api/v1/contacts/:id`: Eliminación lógica (*Soft Delete*) del contacto.
- `POST /api/v1/contacts/:id/notes`: Agrega una nota directamente vinculada al contacto.
- `GET /api/v1/contacts/:id/notes`: Lista todas las notas asociadas al contacto.

### 2. Notas (`/api/v1/notes`)

- `POST /api/v1/notes`: Crea una nota especificando `contactId` y `content`.
- `GET /api/v1/notes/:id`: Obtiene los detalles de una nota específica.
- `DELETE /api/v1/notes/:id`: Eliminación lógica (*Soft Delete*) de la nota.

### 3. Health Check (`/api/v1/health`)

- `GET /api/v1/health`: Verifica la operatividad de la API y la conectividad activa con PostgreSQL (`SELECT 1`).

---

## Qué faltó y qué se mejoraría con más tiempo

1. **Paginación en Contactos y Notas**: Implementar paginación cursor-based o `limit`/`offset` (`page`, `limit`) con metadatos de respuesta (`total`, `totalPages`, `hasNextPage`) para evitar sobrecarga de memoria al escalar a miles de registros.
2. **Pruebas de Integración y End-to-End (E2E)**: Configurar suites E2E completas con Testcontainers para ejecutar pruebas automatizadas contra una base de datos PostgreSQL real y aislada en CI/CD.
3. **Autenticación y Autorización (JWT / RBAC)**: Incorporar soporte multi-inquilino (*multi-tenant*) y control de acceso basado en roles para asegurar los contactos por usuario/organización.
4. **Pipeline de CI/CD (GitHub Actions)**: Crear `.github/workflows/ci.yml` para automatizar la ejecución de `oxlint`, `vitest` y `nest build` en cada Pull Request.
5. **Rate Limiting y Seguridad Adicional**: Configurar `@nestjs/throttler` para prevenir abusos de fuerza bruta y `helmet` para cabeceras HTTP seguras.
