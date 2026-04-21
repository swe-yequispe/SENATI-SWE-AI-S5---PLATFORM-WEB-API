import { Link } from "react-router-dom";
import { Badge, Button, Card } from "./ui";
import type { Product } from "../types/store";

interface ProductCardProps {
  product: Product;
  onAdd: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
}

const categoryLabel: Record<Product["category"], string> = {
  pc: "PC",
  laptop: "Laptop",
  celular: "Celular",
  tablet: "Tablet",
  video: "Video",
  teclado: "Teclado",
  audio: "Audio",
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);
};

export const ProductCard = ({
  product,
  onAdd,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps): JSX.Element => {
  return (
    <Card
      as="article"
      className="group flex h-full min-h-[420px] flex-col overflow-hidden border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative">
          <img src={product.image} alt={product.name} className="h-48 w-full object-cover" loading="lazy" />
          <div className="absolute left-3 top-3">
            <Badge>{categoryLabel[product.category]}</Badge>
          </div>
          {onToggleWishlist && (
            <button
              type="button"
              aria-label={isWishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
              onClick={(event) => {
                event.preventDefault();
                onToggleWishlist(product.id);
              }}
              className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                isWishlisted
                  ? "border-rose-200 bg-rose-100 text-rose-700 hover:bg-rose-200"
                  : "border-white/70 bg-white/90 text-slate-500 hover:bg-white hover:text-rose-600"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
                <path d="M12 21s-7-4.4-9.2-8.4A5.4 5.4 0 0 1 12 5.6a5.4 5.4 0 0 1 9.2 7c-2.2 4-9.2 8.4-9.2 8.4Z" />
              </svg>
            </button>
          )}
        </div>
      </Link>

      <div className="flex h-full flex-col space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-h-[64px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">SKU {product.sku}</p>
            <Link
              to={`/products/${product.id}`}
              className="block max-h-[48px] overflow-hidden text-base font-semibold text-slate-900 hover:text-blue-700"
            >
              {product.name}
            </Link>
          </div>
          <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
            {product.rating.toFixed(1)} / 5
          </span>
        </div>

        <p className="min-h-[40px] max-h-[40px] overflow-hidden text-sm text-slate-600">{product.description}</p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="text-lg font-bold text-slate-900">{formatCurrency(product.price)}</p>
          <div className="flex items-center gap-2">
            <Link
              to={`/products/${product.id}`}
              className="inline-flex rounded-xl bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300"
            >
              Ver
            </Link>
            <Button onClick={() => onAdd(product.id)} className="px-3 py-2 text-xs">
              Agregar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
