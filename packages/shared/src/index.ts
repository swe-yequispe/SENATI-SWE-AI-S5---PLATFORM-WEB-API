export type EstadoPedido = "pendiente" | "aprobado";

export interface Pedido {
  id: string;
  descripcion: string;
  estado: EstadoPedido;
}

export interface CrearPedidoInput {
  descripcion: string;
}
