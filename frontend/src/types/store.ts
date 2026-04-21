export type ProductCategory = "pc" | "laptop" | "celular" | "teclado" | "audio";

export interface Product {
  id: string;
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
