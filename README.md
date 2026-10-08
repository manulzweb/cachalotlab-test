# Cachalot CRM Contacts App

Solución integral de CRM para la gestión de contactos y notas de clientes con arquitectura desacoplada: **Backend REST en NestJS con TypeScript**, **Frontend SPA interactivo en React 19 + Vite** y orquestación completa con **PostgreSQL**, **Nginx** y **Docker Compose**.

---

## 🚀 Instalación y Ejecución Rápida

### Requisitos Previos
- **Docker** (v20+) y **Docker Compose** (v2+).
- *(Opcional para desarrollo local sin contenedores)*: Node.js v20+ y PostgreSQL 15+.

---

### 1. Variables de Entorno

Copia el archivo de variables de entorno base:

```bash
cp .env.example .env
```

El archivo `.env` ya viene preconfigurado con valores listos para levantar el entorno de desarrollo y pruebas.

---

### 2. Ejecución con Docker Compose (Recomendado)

Construye y levanta toda la infraestructura con un único comando:

```bash
docker compose up -d --build
```

Este comando orquesta:
- **`postgres`**: PostgreSQL 15 en el puerto `5432` con volumen persistente (`pgdata`), healthcheck automático y carga del script de inicialización (`docker/init.sql`).
- **`api`**: Backend NestJS (puerto interno `3000`), conectado y dependiente del estado *healthy* de PostgreSQL.
- **`frontend`**: Single Page Application en React 19 + Vite empaquetada sobre un servidor web `nginx:alpine` (puerto interno `80`).
- **`nginx`**: Proxy inverso y API Gateway principal en el puerto `80`.

#### Enlaces de Acceso Local
- 🌐 **Aplicación Web (Frontend SPA)**: [http://localhost/](http://localhost/)
- 📖 **Documentación Interactiva Swagger / OpenAPI**: [http://localhost/api/docs](http://localhost/api/docs)
- 🩺 **Healthcheck del Sistema**: [http://localhost/api/v1/health](http://localhost/api/v1/health)

Para detener los contenedores:
```bash
docker compose down
```

---

### 3. Ejecución Local en Desarrollo (Host)

Si prefieres ejecutar el código directamente en tu máquina host sin dockerizar el frontend o backend:

#### Paso A: Levantar solo PostgreSQL
```bash
docker compose up -d postgres
```

#### Paso B: Backend (NestJS)
```bash
cd app/backend
npm install
npm run start:dev
```
*API disponible en `http://localhost:3000/api/v1` y Swagger en `http://localhost:3000/api/docs`.*

#### Paso C: Frontend (React 19 + Vite)
```bash
cd app/frontend
npm install
npm run dev
```
*Frontend disponible en `http://localhost:5173`.*

---

## 🧪 Pruebas Automatizadas

El proyecto cuenta con suite de pruebas unitarias implementadas con **Vitest**:

```bash
# Ejecución de pruebas unitarias en Backend
cd app/backend
npm run test

# Verificación de linter
npm run lint

# Verificación de compilación de Frontend
cd app/frontend
npm run build
```

---

## 📡 Ejemplos de Llamadas a la API (`cURL`)

Todos los endpoints están versionados bajo `/api/v1`.

### 👤 Contactos (`/api/v1/contacts`)

#### 1. Crear un Contacto (`POST /api/v1/contacts`)
```bash
curl -X POST http://localhost/api/v1/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grace Hopper",
    "email": "grace.hopper@usnavy.mil",
    "phone": "+1 202 555 0199",
    "company": "US Navy"
  }'
```
**Respuesta (`201 Created`):**
```json
{
  "id": 3,
  "name": "Grace Hopper",
  "email": "grace.hopper@usnavy.mil",
  "phone": "+1 202 555 0199",
  "company": "US Navy",
  "createdAt": "2026-10-08T12:00:00.000Z",
  "updatedAt": "2026-10-08T12:00:00.000Z"
}
```

#### 2. Listar Contactos con Filtros Opcionales (`GET /api/v1/contacts`)
```bash
# Todos los contactos
curl -X GET http://localhost/api/v1/contacts

# Filtrar por nombre y empresa
curl -X GET "http://localhost/api/v1/contacts?name=Grace&company=Navy"
```

#### 3. Obtener Detalle de un Contacto (`GET /api/v1/contacts/:id`)
```bash
curl -X GET http://localhost/api/v1/contacts/1
```

#### 4. Actualizar Parcialmente un Contacto (`PATCH /api/v1/contacts/:id`)
```bash
curl -X PATCH http://localhost/api/v1/contacts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+44 20 7946 9999",
    "company": "Bletchley Park & Alan Lab"
  }'
```

#### 5. Eliminar un Contacto (`DELETE /api/v1/contacts/:id` - Soft Delete)
```bash
curl -X DELETE http://localhost/api/v1/contacts/1
```
**Respuesta (`200 OK`):**
```json
{
  "message": "Contacto #1 eliminado exitosamente"
}
```

---

### 📝 Notas de Contactos (`/api/v1/contacts/:id/notes` y `/api/v1/notes`)

#### 6. Agregar una Nota a un Contacto (`POST /api/v1/contacts/:id/notes`)
```bash
curl -X POST http://localhost/api/v1/contacts/1/notes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Reunión de seguimiento agendada para el próximo martes."
  }'
```
**Respuesta (`201 Created`):**
```json
{
  "id": 2,
  "content": "Reunión de seguimiento agendada para el próximo martes.",
  "contactId": 1,
  "createdAt": "2026-10-08T12:05:00.000Z",
  "updatedAt": "2026-10-08T12:05:00.000Z"
}
```

#### 7. Listar Notas de un Contacto (`GET /api/v1/contacts/:id/notes`)
```bash
curl -X GET http://localhost/api/v1/contacts/1/notes
```

#### 8. Obtener Detalle de una Nota (`GET /api/v1/notes/:id`)
```bash
curl -X GET http://localhost/api/v1/notes/1
```

#### 9. Eliminar una Nota (`DELETE /api/v1/notes/:id` - Soft Delete)
```bash
curl -X DELETE http://localhost/api/v1/notes/1
```
**Respuesta (`200 OK`):**
```json
{
  "message": "Nota #1 eliminada exitosamente"
}
```

---

### 🩺 Estado del Sistema (`/api/v1/health`)

#### 10. Healthcheck (`GET /api/v1/health`)
```bash
curl -X GET http://localhost/api/v1/health
```
**Respuesta (`200 OK`):**
```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## 🤖 Uso de IA

Para el desarrollo y optimización de esta solución se utilizaron herramientas de inteligencia artificial como asistente de pair-programming. A continuación se resume para qué se empleó y los criterios técnicos de verificación y corrección aplicados:

### ¿Para qué se usó la IA?
1. **Generación de la UI base y estilizado**: Creación inicial de los componentes del frontend en React 19 con DaisyUI, Tailwind CSS y animaciones en canvas.
2. **Estructuración y boilerplate**: Asistencia en la generación de DTOs con decoradores de OpenAPI/Swagger y plantillas de configuración para Docker Compose multi-etapa.
3. **Casos de prueba**: Propuesta inicial de tests unitarios con Vitest y mocks de servicios.

### ¿Qué se tuvo que corregir, refactorizar y verificar manualmente?
1. **Resolución de Dependencias Circulares y Tipado en Mappers**:
   - Inicialmente se introdujo el uso de `DeepPartial<T>` de TypeORM en los mappers, lo que generaba referencias circulares de tipos complejas y acoplamiento con entidades.
   - **Corrección**: Se eliminó `DeepPartial` y la instanciación de clases con `new Entity()`, reemplazándolos por interfaces de persistencia planas y explícitas (`CreateContactPersistence`, `UpdateContactPersistence`, `CreateNotePersistence`) cumpliendo **SOLID** y **KISS**.
2. **Inyección de Dependencias Limpia en NestJS**:
   - Se verificó que `NotesModule` no dependiera de `ContactRepository`, eliminando dependencias circulares entre módulos y logrando un flujo estrictamente unidireccional: $\text{ContactsModule} \longrightarrow \text{NotesModule}$.
3. **Eliminación de Sobreingeniería Defensiva y Código Redundante**:
   - Se descartaron validaciones redundantes de tipo (`typeof`) que ya resolvía `ValidationPipe`.
   - Se eliminaron wrappers innecesarios como `toResponseDtoList`, utilizando en su lugar mapeos funcionales directos `.map(ContactMapper.toResponseDto)`.
   - Se optimizó el flujo en `ContactDao.update` eliminando `SELECTs` duplicados previos.
4. **Sincronización Reactiva en el Frontend**:
   - Se detectó y corrigió un desfase en el contador de notas de las tarjetas de cliente: `getContacts()` fue ajustado para resolver las notas asociadas y `handleAddNote` actualiza tanto el estado local del drawer como el conteo global de tarjetas en tiempo real.
5. **Alertas con SweetAlert2**:
   - Sustitución de `window.confirm` y `alert` nativos por alertas personalizadas estilizadas con el tema *Dark Glassmorphism* de la aplicación.

---

## 🏗️ Estructura del Repositorio

```text
├── app/
│   ├── backend/          # API REST (NestJS, TypeScript, TypeORM, Vitest)
│   │   ├── src/
│   │   │   ├── config/   # Configuración y validación de variables de entorno
│   │   │   └── modules/  # Módulos: contacts, notes, health
│   │   └── Dockerfile    # Multi-stage build para producción
│   └── frontend/         # SPA (React 19, Vite, Tailwind CSS, DaisyUI, SweetAlert2)
│       ├── src/
│       │   ├── components/# Componentes modales, drawer y efectos
│       │   └── services/  # Cliente API y servicio de alertas
│       └── Dockerfile    # Multi-stage build servido con Nginx
├── docker/
│   └── init.sql          # Esquema de BD, índices y datos iniciales (seed)
├── nginx/
│   └── default.conf      # Proxy inverso y balanceador de carga
├── docker-compose.yml    # Orquestación de servicios (postgres, api, frontend, nginx)
├── .env.example          # Plantilla de variables de entorno
└── README.md
```
