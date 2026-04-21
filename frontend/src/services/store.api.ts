import type {
  ConfirmPaymentResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  Product,
} from "../types/store";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

interface ApiErrorBody {
  message?: string;
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new Error(body.message ?? "Error en la API de tienda");
  }

  return (await response.json()) as T;
};

export const fetchProductsApi = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/store/products`);
  return parseResponse<Product[]>(response);
};

export const createOrderApi = async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
  const response = await fetch(`${API_URL}/store/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseResponse<CreateOrderResponse>(response);
};

export const confirmPaymentApi = async (
  orderId: number,
  paymentReference: string,
): Promise<ConfirmPaymentResponse> => {
  const response = await fetch(`${API_URL}/store/orders/${orderId}/confirm-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentReference }),
  });

  return parseResponse<ConfirmPaymentResponse>(response);
};
