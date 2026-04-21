# Pedidos Web App (Monorepo TS)

Aplicacion de pedidos con flujo completo:
1. Crear pedido
2. Aprobar pedido
3. Listar pedidos en JSON (API)
4. Mostrar pedidos en interfaz React

## Stack
- Frontend: React + Vite + Tailwind CSS + TypeScript
- Backend: Node.js + Express + TypeScript
- Datos: almacenamiento en memoria (V1)
- Tipos compartidos: `packages/shared`

## Estructura
- `frontend`: interfaz y consumo de API
- `backend`: endpoints y logica de pedidos
- `packages/shared`: contrato `Pedido` y `EstadoPedido`

## Endpoints
- `POST /pedidos`
  - Body: `{ "descripcion": "..." }`
  - Crea pedido con estado inicial `pendiente`
- `PUT /pedidos/:id`
  - Aprueba pedido existente
  - Retorna `404` si no existe
- `GET /pedidos`
  - Retorna lista JSON de pedidos

### Tienda virtual (MySQL real)
- `GET /store/products`
  - Lista productos activos de la tienda.
- `POST /store/orders`
  - Body:
  - `{ "customerName": "...", "customerEmail": "...", "items": [{ "productId": "1", "quantity": 2 }] }`
  - Crea orden en estado `pending_payment` y retorna referencia de pago.
- `POST /store/orders/:orderId/confirm-payment`
  - Body: `{ "paymentReference": "PAY-..." }`
  - Confirma compra y marca orden como pagada (sin verificacion externa por ahora).
- `GET /mysql/pedidos`
  - Vista de ordenes en MySQL con items/productos.

## Requisitos
- Docker Desktop (o Docker Engine + Compose plugin)
- Node.js 20+ y npm 10+ (solo para comandos npm del monorepo)

## Variables de entorno backend (MySQL)
- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `3306`)
- `DB_NAME` (default: `senatiwebapi`)
- `DB_USER` (default: `root`)
- `DB_PASSWORD` (default: ``)
- `CORS_ORIGIN` (lista separada por comas; ejemplo: `http://localhost:5173,https://techstore.pe`)

## Variables de entorno frontend
- `VITE_API_URL` (default local recomendado: `http://localhost:3001`)

Archivos de ejemplo:
- `backend/.env.example`
- `frontend/.env.example`

## Instalacion
```bash
npm install
```

## Desarrollo (Docker, sin XAMPP)
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:3002
- MySQL: contenedor Docker interno (`db`)

Comando local opcional (solo si quieres correr fuera de Docker):
```bash
npm run dev:local
```

## Scripts
```bash
npm run dev      # desarrollo con Docker (recomendado, sin XAMPP)
npm run dev:local # frontend + backend en local (opcional)
npm run build    # build shared + backend + frontend
npm run test     # tests backend + frontend
npm run docker:up
npm run docker:down
npm run docker:logs
npm run docker:dev:up
npm run docker:dev:down
npm run docker:dev:logs
```

## Makefile (opcional)
Si usas `make`, tienes atajos equivalentes:

```bash
make install
make dev
make dev-local
make test
make build
make docker-up
make docker-dev-up
```

## Docker (recomendado para despliegue)
Levanta todo el stack (frontend + backend + MySQL):

```bash
npm run docker:up
```

Servicios:
- Frontend: `http://localhost:8080`
- Backend health (via proxy frontend): `http://localhost:8080/api/health`
- MySQL: acceso interno solo por red Docker (no expuesto al host)

Detener stack:
```bash
npm run docker:down
```

## Despliegue en hosting (produccion)
### Opcion 1: Docker Compose (VPS)
1. Clona el repositorio en tu servidor.
2. Define DNS del dominio (por ejemplo `techstore.pe`) apuntando al VPS.
3. Ejecuta:
```bash
npm ci
npm run docker:up
```
4. Publica el puerto `8080` o mapealo a `80/443` con proxy reverso.
5. Configura TLS (Nginx Proxy Manager, Caddy o certbot).

### Opcion 2: Frontend y backend en servicios separados
1. Frontend estatico:
   - Build: `npm run build -w frontend`
   - Publicar carpeta `frontend/dist`.
2. Backend Node:
   - Build: `npm run build -w backend`
   - Start: `npm run start -w backend`
3. Define:
   - `VITE_API_URL` en frontend con la URL publica del backend.
   - `CORS_ORIGIN` en backend con la URL publica del frontend.

## SEO tecnico incluido
- Metadatos SEO base en `frontend/index.html`.
- Open Graph y Twitter Cards.
- Datos estructurados JSON-LD tipo `Store`.
- `robots.txt`, `sitemap.xml` y `site.webmanifest` en `frontend/public`.

Antes de publicar:
1. Reemplaza `https://techstore.pe` por tu dominio real en:
   - `frontend/index.html`
   - `frontend/public/robots.txt`
   - `frontend/public/sitemap.xml`
2. Verifica indexacion en Google Search Console.

## Docker Dev (hot reload)
Para desarrollo dentro de contenedores (Vite + tsx watch + MySQL):

```bash
npm run docker:dev:up
```

Servicios dev:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3002/health`
- MySQL: `localhost:3307` (`root` / `root`)

Detener entorno dev:
```bash
npm run docker:dev:down
```

## CI (GitHub Actions)
Workflow: `.github/workflows/ci.yml`

Valida automáticamente en push/PR a `main`:
- instalación (`npm ci`)
- tests (`npm run test`)
- build (`npm run build`)
- sintaxis de `docker-compose.yml` y `docker-compose.dev.yml`

## Flujo de uso
1. Abre la UI en `http://localhost:5173`.
2. Crea pedidos con el formulario.
3. Aprueba pedidos con el boton `Aprobar`.
4. Verifica API en `GET http://localhost:3001/pedidos`.

## Validaciones implementadas
- No se permite crear pedidos vacios.
- No se permite aprobar pedidos inexistentes (`404`).
- Manejo de errores JSON en backend y frontend.
- Actualizacion de UI sin recargar pagina.


## UI Guide
- Ver [frontend/UI_GUIDE.md](frontend/UI_GUIDE.md) para estandares de componentes y estilos.

