import { randomUUID } from "node:crypto";
import type { CrearPedidoInput, Pedido } from "@pedidos/shared";
import { HttpError } from "../types/http-error.js";

const pedidos = new Map<string, Pedido>();

const generarId = (): string => {
  return randomUUID();
};

export const crearPedido = (input: CrearPedidoInput): Pedido => {
  const pedido: Pedido = {
    id: generarId(),
    descripcion: input.descripcion,
    estado: "pendiente",
  };

  pedidos.set(pedido.id, pedido);
  return pedido;
};

export const aprobarPedido = (id: string): Pedido => {
  const pedido = pedidos.get(id);

  if (!pedido) {
    throw new HttpError(404, "Pedido no encontrado");
  }

  const actualizado: Pedido = { ...pedido, estado: "aprobado" };
  pedidos.set(id, actualizado);

  return actualizado;
};

export const listarPedidos = (): Pedido[] => {
  return Array.from(pedidos.values());
};

export const resetPedidosStore = (): void => {
  pedidos.clear();
};
