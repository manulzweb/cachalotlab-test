# Cachalot CRM Contacts API

API REST diseñada con **Node.js**, **NestJS** y **TypeScript** para la gestión de contactos de clientes y notas para un CRM, respaldada por **PostgreSQL** y orquestada con **Docker Compose**.

---

## 🏛️ Arquitectura y Decisiones de Diseño

El proyecto implementa una arquitectura en capas limpia, desacoplada y predecible:

1. **Controladores (`Controllers`)**: Manejan las solicitudes HTTP, validación inicial de parámetros y enrutamiento.
2. **Servicios (`Services`)**: Orquestan la lógica de negocio y validan reglas del dominio.
3. **Capa Mapper (`Mappers`)**: Aísla las entidades de base de datos de los contratos públicos (DTOs), transformando `CreateContactDto` / `UpdateContactDto` a entidades y entidades a `ContactResponseDto` / `NoteResponseDto`.
4. **Capa de Acceso a Datos (`DAO`)**: Encapsula las operaciones de persistencia y consultas personalizadas (ej. búsquedas con operadores `ILIKE` para filtros por nombre y empresa).
5. **Observabilidad (`@nestjs/observe`)**: Instrumentación de observabilidad distribuida y métricas de desempeño integrada.

---

## 📋 Requisitos Previos

- **Node.js**: v20 o superior
- **Docker** y **Docker Compose**

---

## 🚀 Puesta en Marcha

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

### 2. Levantar con Docker Compose (Recomendado)

Inicia PostgreSQL, la API y el balanceador de carga Nginx en segundo plano:

```bash
docker compose up -d
```

Verifica el estado de los servicios:
```bash
docker compose ps
```

### 3. Ejecución en Desarrollo Local (Alternativa)

Si deseas ejecutar la base de datos en Docker y la API directamente en tu máquina local:

```bash
# 1. Iniciar solo PostgreSQL
docker compose up -d postgres

# 2. Instalar dependencias
npm install

# 3. Iniciar la API en modo watch
npm run start:dev
```

La API estará disponible en `http://localhost:3000`.

---

## 🧪 Pruebas Automatizadas

El proyecto utiliza **Vitest** para pruebas unitarias de alta velocidad:

```bash
# Ejecutar todas las pruebas unitarias
npm run test

# Ejecutar pruebas en modo observador (watch)
npm run test:watch

# Ejecutar pruebas con reporte de cobertura
npm run test:cov
```

---

## 📚 Documentación de Endpoints

### 1. Contactos

#### Crear un Contacto
- **Método**: `POST`
- **Ruta**: `/contacts`
- **Body**:
  ```json
  {
    "name": "Manuel Zapata",
    "email": "manuel@cachalot.com",
    "phone": "+573001234567",
    "company": "Cachalot Lab"
  }
  ```
- **Respuesta (`201 Created`)**:
  ```json
  {
    "id": 1,
    "name": "Manuel Zapata",
    "email": "manuel@cachalot.com",
    "phone": "+573001234567",
    "company": "Cachalot Lab",
    "createdAt": "2026-10-07T22:30:00.000Z",
    "updatedAt": "2026-10-07T22:30:00.000Z",
    "notes": []
  }
  ```

#### Listar Contactos (con búsqueda opcional)
- **Método**: `GET`
- **Ruta**: `/contacts`
- **Filtros por Query Params**:
  - `?name=Manuel`: Búsqueda parcial por nombre (case-insensitive).
  - `?company=Cachalot`: Búsqueda parcial por empresa (case-insensitive).
- **Ejemplo**: `GET /contacts?name=Manuel&company=Cachalot`
- **Respuesta (`200 OK`)**:
  ```json
  [
    {
      "id": 1,
      "name": "Manuel Zapata",
      "email": "manuel@cachalot.com",
      "phone": "+573001234567",
      "company": "Cachalot Lab",
      "createdAt": "2026-10-07T22:30:00.000Z",
      "updatedAt": "2026-10-07T22:30:00.000Z",
      "notes": []
    }
  ]
  ```

#### Ver un Contacto por ID
- **Método**: `GET`
- **Ruta**: `/contacts/:id`
- **Respuesta (`200 OK`)**: Retorna el contacto junto con el listado de sus notas asociadas.
- **Error (`404 Not Found`)**: Si el contacto no existe.

#### Actualizar Contacto
- **Método**: `PATCH`
- **Ruta**: `/contacts/:id`
- **Body**: Campos parciales (`name`, `email`, `phone`, `company`).

#### Eliminar Contacto
- **Método**: `DELETE`
- **Ruta**: `/contacts/:id`
- **Respuesta (`200 OK`)**: `{ "message": "Contacto #1 eliminado exitosamente" }`

---

### 2. Notas

#### Agregar Nota a un Contacto
- **Método**: `POST`
- **Ruta**: `/contacts/:id/notes`
- **Body**:
  ```json
  {
    "content": "Llamada de seguimiento el 5 de octubre"
  }
  ```
- **Respuesta (`201 Created`)**:
  ```json
  {
    "id": 1,
    "content": "Llamada de seguimiento el 5 de octubre",
    "contactId": 1,
    "createdAt": "2026-10-07T22:35:00.000Z",
    "updatedAt": "2026-10-07T22:35:00.000Z"
  }
  ```

#### Listar Notas de un Contacto
- **Método**: `GET`
- **Ruta**: `/contacts/:id/notes`
- **Respuesta (`200 OK`)**: Listado ordenado cronológicamente de las notas asociadas al contacto.

---

### 3. Health Check

- **Método**: `GET`
- **Ruta**: `/health`
- **Respuesta (`200 OK`)**: `{ "status": "ok" }`

---

## 💡 Próximas Mejoras (Con Más Tiempo)

- **Paginación**: Implementar paginación cursor-based o límite/desplazamiento (`limit`, `offset`) en la lista de contactos.
- **Autenticación y Autorización**: Soporte multi-inquilino (*multi-tenant*) con JWT y RBAC.
- **Pruebas End-to-End**: Integración con Testcontainers para pruebas de integración con PostgreSQL real en CI/CD.
