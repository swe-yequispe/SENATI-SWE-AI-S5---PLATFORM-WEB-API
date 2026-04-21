import { Alert, Badge, Button, Card } from "./ui";
import type { CartLine } from "../types/store";

interface CartPanelProps {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);
};

export const CartPanel = ({
  lines,
  itemCount,
  subtotal,
  shipping,
  total,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
}: CartPanelProps): JSX.Element => {
  return (
    <Card as="section" className="sticky top-6 space-y-4 border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Carrito de compras</h2>
        <Badge>{itemCount} productos</Badge>
      </div>

      {lines.length === 0 ? (
        <Alert variant="info">Tu carrito esta vacio. Agrega productos del catalogo.</Alert>
      ) : (
        <ul className="space-y-3">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-500">{formatCurrency(product.price)} c/u</p>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                  onClick={() => onRemove(product.id)}
                >
                  Quitar
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button type="button" className="px-2 py-1 text-xs" onClick={() => onDecrease(product.id)}>
                    -
                  </Button>
                  <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                  <Button type="button" className="px-2 py-1 text-xs" onClick={() => onIncrease(product.id)}>
                    +
                  </Button>
                </div>
                <p className="text-sm font-semibold text-slate-900">{formatCurrency(product.price * quantity)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-2 border-t border-slate-200 pt-3 text-sm text-slate-700">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Envio</span>
          <span>{shipping === 0 ? "Gratis" : formatCurrency(shipping)}</span>
        </div>
        <div className="flex items-center justify-between text-base font-bold text-slate-900">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="grid gap-2">
        <Button type="button" disabled={lines.length === 0}>
          Proceder al pago
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="bg-slate-200 text-slate-700 hover:bg-slate-300"
          disabled={lines.length === 0}
          onClick={onClear}
        >
          Vaciar carrito
        </Button>
      </div>
    </Card>
  );
};
