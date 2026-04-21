import type { Pedido } from "@pedidos/shared";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

interface ApiErrorBody {
  message?: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new Error(body.message ?? "Error de comunicacion con la API");
  }

  return (await response.json()) as T;
};

export const listarPedidosApi = async (): Promise<Pedido[]> => {
  const response = await fetch(`${API_URL}/pedidos`);
  return handleResponse<Pedido[]>(response);
};

export const crearPedidoApi = async (descripcion: string): Promise<Pedido> => {
  const response = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ descripcion }),
  });

  return handleResponse<Pedido>(response);
};

export const aprobarPedidoApi = async (id: string): Promise<Pedido> => {
  const response = await fetch(`${API_URL}/pedidos/${id}`, {
    method: "PUT",
  });

  return handleResponse<Pedido>(response);
};
