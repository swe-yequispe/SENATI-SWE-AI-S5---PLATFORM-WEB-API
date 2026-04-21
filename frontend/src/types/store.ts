export type ProductCategory = "pc" | "laptop" | "celular" | "tablet" | "audio" | "video" | "teclado";

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  rating: number;
  image: string;
}

export interface CartLine {
  product: Product;
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  items: Array<{ productId: string; quantity: number }>;
}

export interface CreateOrderResponse {
  orderId: number;
  paymentReference: string;
  amount: number;
  status: "requires_confirmation";
}

export interface ConfirmPaymentResponse {
  orderId: number;
  status: "paid";
  message: string;
  paymentReference: string;
  paidAt: string;
}