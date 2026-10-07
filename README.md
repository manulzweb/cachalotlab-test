# CRM Contacts API

API REST construida con Node.js (NestJS, TypeScript) y PostgreSQL para gestionar contactos de clientes de un CRM.

## Prerrequisitos

- Node.js (v20 o superior recomendado)
- Docker y Docker Compose

## Configuración del entorno

1. Clonar el repositorio.
2. Crear el archivo `.env` a partir de `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Instalar las dependencias:
   ```bash
   npm install
   ```

## Ejecución del proyecto

### 1. Iniciar servicios de infraestructura (PostgreSQL, Nginx, API)
```bash
docker compose up -d
```

### 2. Ejecutar la API en desarrollo local
```bash
npm run start:dev
```

### 3. Ejecutar pruebas unitarias
```bash
npm run test
```
