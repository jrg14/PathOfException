# PathOfException

Estructura base inspirada en `fastapi/full-stack-fastapi-template`, usando:
- FastAPI
- fastapi-users
- SQLAlchemy async
- PostgreSQL
- Frontend React + Vite

## Estructura

```txt
.
├── .env
├── .env.example
├── docker-compose.yml
├── backend
│   ├── Dockerfile
│   ├── pyproject.toml
│   ├── app
│   │   ├── main.py
│   │   ├── api
│   │   │   ├── main.py
│   │   │   └── routes
│   │   │       ├── auth.py
│   │   │       ├── skills.py
│   │   │       └── users.py
│   │   ├── core
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── db
│   │   │   ├── base.py
│   │   │   └── session.py
│   │   ├── modules
│   │   │   ├── skills
│   │   │   │   ├── models.py
│   │   │   │   └── schemas.py
│   │   │   └── users
│   │   │       ├── dependencies.py
│   │   │       ├── models.py
│   │   │       └── schemas.py
│   │   └── tests
│   └── scripts
│       └── init_db.py
└── frontend
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src
        └── main.jsx
```

## Levantar con Docker

```bash
docker compose up --build -d
```

## Frontend con pnpm

```bash
cd frontend
pnpm install
pnpm dev
```

Inicializar tablas:

```bash
docker compose exec backend python /app/scripts/init_db.py
```

También se crean automáticamente al iniciar la app si `AUTO_CREATE_TABLES=true`.

## Migraciones (Alembic)

Migrar a la última versión:

```bash
docker compose exec backend alembic upgrade head
```

Crear una nueva migración automática desde modelos:

```bash
docker compose exec backend alembic revision --autogenerate -m "describe change"
```

Para producción:
- usar `AUTO_CREATE_TABLES=false`
- ejecutar `alembic upgrade head` en el despliegue antes de arrancar la API

## Endpoints de auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/jwt/login`
- `POST /api/v1/auth/jwt/logout`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `POST /api/v1/auth/request-verify-token`
- `POST /api/v1/auth/verify`
- `GET /api/v1/users/me`
- `GET /api/v1/skills/`

## Nota

Esta base está preparada para que el siguiente paso sea añadir Alembic y modelos de dominio.
