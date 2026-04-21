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
- Node.js 20+
- npm 10+
- MySQL 8+

## Variables de entorno backend (MySQL)
- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `3306`)
- `DB_NAME` (default: `senatiwebapi`)
- `DB_USER` (default: `root`)
- `DB_PASSWORD` (default: ``)

## Instalacion
```bash
npm install
```

## Desarrollo
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Scripts
```bash
npm run dev      # frontend + backend
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

## Docker Dev (hot reload)
Para desarrollo dentro de contenedores (Vite + tsx watch + MySQL):

```bash
npm run docker:dev:up
```

Servicios dev:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001/health`
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

