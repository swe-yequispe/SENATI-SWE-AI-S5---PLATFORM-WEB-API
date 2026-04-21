import { Badge, Button, Card } from "./ui";
import type { Product } from "../types/store";

interface ProductCardProps {
  product: Product;
  onAdd: (productId: string) => void;
}

const categoryLabel: Record<Product["category"], string> = {
  pc: "PC",
  laptop: "Laptop",
  celular: "Celular",
  teclado: "Teclado",
  audio: "Audio",
};

export const ProductCard = ({ product, onAdd }: ProductCardProps): JSX.Element => {
  return (
    <Card as="article" className="overflow-hidden border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
      <img src={product.image} alt={product.name} className="h-44 w-full object-cover" loading="lazy" />
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <Badge>{categoryLabel[product.category]}</Badge>
          <span className="text-xs font-medium text-slate-500">{product.rating.toFixed(1)} / 5</span>
        </div>
        <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
        <p className="text-sm text-slate-600">{product.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-slate-900">S/ {product.price.toFixed(2)}</p>
          <Button onClick={() => onAdd(product.id)} className="px-3 py-2 text-xs">
            Agregar al carrito
          </Button>
        </div>
      </div>
    </Card>
  );
};
