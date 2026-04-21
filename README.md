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
- `GET /mysql/pedidos`
  - Retorna pedidos desde MySQL usando Sequelize
  - Requiere variables `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

## Requisitos
- Node.js 20+
- npm 10+

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
```

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

