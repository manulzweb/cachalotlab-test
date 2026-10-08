# Cachalot CRM Contacts App

Solución integral de CRM para la gestión de contactos y notas de clientes con arquitectura desacoplada: **Backend REST en NestJS con TypeScript**, **Frontend SPA interactivo en React 19 + Vite** y orquestación completa con **PostgreSQL**, **Nginx** y **Docker Compose**.

---

## Estructura del Proyecto

El repositorio está organizado en una arquitectura modular limpia:

```text
├── app/
│   ├── backend/          # API REST desarrollada con NestJS, TypeScript, TypeORM y Vitest
│   └── frontend/         # SPA desarrollada con React 19, Vite, Tailwind CSS, DaisyUI y ReactBits
├── docker/
│   └── init.sql          # Script de inicialización con esquema, índices y datos iniciales
├── nginx/
│   └── default.conf      # Configuración de Nginx como proxy inverso y balanceador de carga
├── docker-compose.yml    # Orquestación de contenedores (postgres, backend, frontend, nginx)
├── .env.example          # Plantilla de variables de entorno
└── README.md
```

---

## Arquitectura y Decisiones de Diseño

### Backend (`app/backend`)
1. **Controladores (`Controllers`)**: Manejan las peticiones HTTP, validación de parámetros, versionamiento (`/api/v1`) y contratos OpenAPI/Swagger.
2. **Servicios (`Services`)**: Contienen la lógica de negocio y validación de reglas de dominio (como unicidad de correos electrónicos).
3. **Mappers**: Aíslan los modelos de base de datos de los contratos públicos (DTOs).
4. **Capa DAO / Repositorios**: Persistencia con TypeORM, búsquedas parciales (`ILike`) y borrado lógico (*Soft Delete*).
5. **Observabilidad**: Integración de `@nestjs/observe` para instrumentación.

### Frontend (`app/frontend`)
1. **React 19 + TypeScript + Vite**: Configuración moderna, rápida y con tipado estricto.
2. **Estilizado con Tailwind CSS y DaisyUI**: Sistema de diseño consistente con modo oscuro elegante y paneles translúcidos (*glassmorphism*).
3. **Componentes visuales inspirados en ReactBits**:
   - `Squares`: Fondo interactivo animado por canvas con seguimiento de cursor.
   - `SpotlightCard`: Tarjetas de contactos con efecto de luz radial al pasar el cursor.
   - `ShinyText`: Efecto de brillo de texto animado para títulos clave.
4. **Experiencia de Usuario**:
   - Modal interactivo con confetti para la creación de nuevos contactos.
   - Drawer lateral para inspeccionar el contacto, listar notas cronológicas y agregar nuevas notas en tiempo real.
   - Búsqueda y filtrado dinámico por nombre o empresa.

---

## Contenedorización e Infraestructura con Docker

### ¿Por qué se utilizó Docker?
- **Reproducibilidad y consistencia de entorno**: Garantiza que la base de datos PostgreSQL, la API NestJS, el frontend React y Nginx se ejecuten idénticamente en cualquier entorno.
- **Aislamiento de dependencias**: Cada servicio corre en su propio contenedor sin requerir Node.js o PostgreSQL en la máquina host.
- **Puesta en marcha con un solo comando**: Levanta la solución completa lista para producción con `docker compose up -d`.

### ¿Qué hace el Dockerfile del Backend (`app/backend/Dockerfile`)?
- Construcción multi-etapa (*Multi-Stage Build*):
  - Etapa `builder`: Instala dependencias completas y compila TypeScript a JavaScript en `dist/`.
  - Etapa `production`: Imagen ligera sobre `node:22-alpine`, instalando solo dependencias de producción y ejecutándose bajo el usuario sin privilegios `node`.

### ¿Qué hace el Dockerfile del Frontend (`app/frontend/Dockerfile`)?
- Etapa `builder`: Compila la aplicación React con Vite.
- Etapa `production`: Sirve los archivos estáticos optimizados mediante un servidor `nginx:alpine` liviano con soporte de enrutamiento SPA.

### ¿Qué hace Docker Compose (`docker-compose.yml`)?
Orquesta 4 servicios sobre la red privada `backend`:
1. `postgres`: PostgreSQL 15 con persistencia de volumen (`pgdata`), healthcheck con `pg_isready` y ejecución automática del script `docker/init.sql`.
2. `api`: Backend NestJS escalable dinámicamente (`API_REPLICAS=2`), condicionado a la salud de la base de datos.
3. `frontend`: Servicio web estático con Nginx sirviendo la SPA de React.
4. `nginx`: Gateway principal en el puerto `80`. Enruta `/api/` hacia el cluster de backend y `/` hacia la aplicación frontend.

---

## Puesta en Marcha

### 1. Variables de Entorno

```bash
cp .env.example .env
```

### 2. Levantar la Aplicación Completa con Docker Compose (Recomendado)

```bash
docker compose up -d
```

Acceso:
- **Aplicación Frontend**: `http://localhost/`
- **Documentación Swagger / OpenAPI**: `http://localhost/api/docs`
- **Healthcheck del Sistema**: `http://localhost/api/v1/health`

---

### 3. Desarrollo Local (Sin Docker)

#### Base de Datos:
```bash
docker compose up -d postgres
```

#### Backend:
```bash
cd app/backend
npm install
npm run start:dev
```
Backend disponible en `http://localhost:3000/api/v1` y Swagger en `http://localhost:3000/api/docs`.

#### Frontend:
```bash
cd app/frontend
npm install
npm run dev
```
Frontend disponible en `http://localhost:5173`.

---

## Pruebas Automatizadas

```bash
# Backend (30 pruebas unitarias con Vitest)
cd app/backend
npm run test
npm run lint

# Frontend (Validación de TypeScript y empaquetado de producción)
cd app/frontend
npm run build
```

---

## Endpoints Principales (`/api/v1`)

### Contactos (`/api/v1/contacts`)
- `POST /api/v1/contacts`: Crea un contacto validando unicidad de `email` (`201 Created` / `409 Conflict`).
- `GET /api/v1/contacts`: Lista contactos activos con filtros (`?name=...&company=...`).
- `GET /api/v1/contacts/:id`: Detalle de un contacto con sus notas asociadas.
- `PATCH /api/v1/contacts/:id`: Actualización parcial.
- `DELETE /api/v1/contacts/:id`: Borrado lógico (*Soft Delete*).
- `POST /api/v1/contacts/:id/notes`: Agrega una nota al contacto.
- `GET /api/v1/contacts/:id/notes`: Lista las notas del contacto.

### Notas (`/api/v1/notes`)
- `POST /api/v1/notes`: Crea una nota con `contactId` y `content`.
- `GET /api/v1/notes/:id`: Detalle de una nota.
- `DELETE /api/v1/notes/:id`: Borrado lógico (*Soft Delete*).

### Healthcheck (`/api/v1/health`)
- `GET /api/v1/health`: Estado operativo y verificación activa con PostgreSQL (`SELECT 1`).
