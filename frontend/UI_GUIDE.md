# UI Guide

## Objetivo
Mantener consistencia visual y de codigo en la app usando componentes reutilizables en `src/components/ui`.

## Componentes base
- `Button`
  - Variantes: `primary`, `secondary`
  - Uso: acciones de formulario y acciones por item.
- `TextInput`
  - Campo de entrada estandar para formularios.
- `Card`
  - Contenedor visual para bloques de informacion.
  - `as`: `div | section | article | li`.
- `Badge`
  - Variantes: `neutral`, `success`, `warning`.
  - Uso: estado rapido (por ejemplo `pendiente`, `aprobado`).
- `Alert`
  - Variantes: `error`, `info`, `success`.
  - Uso: mensajes del sistema (errores, confirmaciones, avisos).

## Regla de importacion
Usar siempre barrel export:

```ts
import { Alert, Badge, Button, Card, TextInput } from "./components/ui";
```

Evitar imports directos por archivo salvo casos de refactor interno.

## Estilos
- Definidos en `src/styles.css` con Tailwind CSS v4 (`@layer components`).
- Reutilizar clases de componente (`btn-primary`, `card-base`, etc.) en lugar de repetir utilidades largas.

## Convenciones
- Los componentes UI no contienen logica de negocio.
- La logica de negocio se mantiene en `App`, `PedidoList` y servicios API.
- Cualquier nuevo estado visual debe agregarse primero en UI components y luego consumirse en pantallas.
