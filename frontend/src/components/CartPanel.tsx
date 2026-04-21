import { Alert, Badge, Button, Card, TextInput } from "./ui";
import type { CartLine } from "../types/store";

type CheckoutStep = "cart" | "customer" | "payment" | "success";

interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  document: string;
  address: string;
}

interface PaymentData {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface CompletedOrder {
  orderId: number;
  paymentReference: string;
  paidAt: string;
  total: number;
}

interface CartPanelProps {
  lines: CartLine[];
  selectedMap: Record<string, boolean>;
  selectedCount: number;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  checkoutStep: CheckoutStep;
  customerData: CustomerData;
  paymentData: PaymentData;
  completedOrder: CompletedOrder | null;
  isSubmitting: boolean;
  formError: string | null;
  onToggleSelect: (productId: string) => void;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  onCustomerChange: (field: keyof CustomerData, value: string) => void;
  onPaymentChange: (field: keyof PaymentData, value: string) => void;
  onContinueFromCart: () => void;
  onBackToCart: () => void;
  onContinueFromCustomer: () => void;
  onBackToCustomer: () => void;
  onConfirmPurchase: () => void;
  onRestartFlow: () => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);
};

export const CartPanel = ({
  lines,
  selectedMap,
  selectedCount,
  itemCount,
  subtotal,
  shipping,
  total,
  checkoutStep,
  customerData,
  paymentData,
  completedOrder,
  isSubmitting,
  formError,
  onToggleSelect,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onCustomerChange,
  onPaymentChange,
  onContinueFromCart,
  onBackToCart,
  onContinueFromCustomer,
  onBackToCustomer,
  onConfirmPurchase,
  onRestartFlow,
}: CartPanelProps): JSX.Element => {
  return (
    <Card id="checkout" as="section" className="sticky top-20 space-y-4 border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Checkout</h2>
        <Badge>{itemCount} items</Badge>
      </div>

      <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
        <span className={checkoutStep === "cart" ? "text-teal-700" : "text-slate-500"}>1. Carrito</span>
        <span className={checkoutStep === "customer" ? "text-teal-700" : "text-slate-500"}>2. Cliente</span>
        <span className={checkoutStep === "payment" ? "text-teal-700" : "text-slate-500"}>3. Pago</span>
        <span className={checkoutStep === "success" ? "text-teal-700" : "text-slate-500"}>4. Confirmacion</span>
      </div>

      {formError && <Alert variant="error">{formError}</Alert>}

      {checkoutStep === "cart" && (
        <>
          {lines.length === 0 ? (
            <Alert variant="info">Tu carrito esta vacio. Agrega productos del catalogo.</Alert>
          ) : (
            <ul className="space-y-3">
              {lines.map(({ product, quantity }) => (
                <li key={product.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <label className="flex cursor-pointer items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selectedMap[product.id] ?? false}
                        onChange={() => onToggleSelect(product.id)}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">{formatCurrency(product.price)} c/u</p>
                      </div>
                    </label>
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
              <span>Seleccionados</span>
              <span>{selectedCount} items</span>
            </div>
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
            <Button type="button" disabled={selectedCount === 0} onClick={onContinueFromCart}>
              Continuar con seleccion
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
        </>
      )}

      {checkoutStep === "customer" && (
        <div className="space-y-3">
          <TextInput
            placeholder="Nombre completo (solo letras y espacios)"
            value={customerData.fullName}
            onChange={(event) => onCustomerChange("fullName", event.target.value)}
          />
          <TextInput
            placeholder="Email"
            value={customerData.email}
            onChange={(event) => onCustomerChange("email", event.target.value)}
          />
          <TextInput
            placeholder="Celular (9 digitos, inicia en 9)"
            value={customerData.phone}
            maxLength={9}
            onChange={(event) => onCustomerChange("phone", event.target.value.replace(/\D/g, ""))}
          />
          <TextInput
            placeholder="DNI (8 digitos)"
            value={customerData.document}
            maxLength={8}
            onChange={(event) => onCustomerChange("document", event.target.value.replace(/\D/g, ""))}
          />
          <TextInput
            placeholder="Direccion de entrega"
            value={customerData.address}
            onChange={(event) => onCustomerChange("address", event.target.value)}
          />

          <div className="grid gap-2 sm:grid-cols-2">
            <Button type="button" variant="secondary" onClick={onBackToCart}>
              Volver al carrito
            </Button>
            <Button type="button" onClick={onContinueFromCustomer}>
              Continuar a pago
            </Button>
          </div>
        </div>
      )}

      {checkoutStep === "payment" && (
        <div className="space-y-3">
          <TextInput
            placeholder="Titular de la tarjeta"
            value={paymentData.cardHolder}
            onChange={(event) => onPaymentChange("cardHolder", event.target.value)}
          />
          <TextInput
            placeholder="Numero de tarjeta (16 digitos)"
            value={paymentData.cardNumber}
            maxLength={19}
            onChange={(event) => onPaymentChange("cardNumber", event.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              placeholder="MM/YY"
              value={paymentData.expiry}
              maxLength={5}
              onChange={(event) => onPaymentChange("expiry", event.target.value)}
            />
            <TextInput
              placeholder="CVV"
              value={paymentData.cvv}
              maxLength={3}
              onChange={(event) => onPaymentChange("cvv", event.target.value.replace(/\D/g, ""))}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button type="button" variant="secondary" onClick={onBackToCustomer}>
              Volver a datos
            </Button>
            <Button type="button" onClick={onConfirmPurchase} disabled={isSubmitting}>
              {isSubmitting ? "Procesando compra..." : "Confirmar compra"}
            </Button>
          </div>
        </div>
      )}

      {checkoutStep === "success" && completedOrder && (
        <div className="space-y-3">
          <Alert variant="success">
            Compra exitosa. Orden #{completedOrder.orderId} confirmada con referencia {completedOrder.paymentReference}.
          </Alert>
          <div className="rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
            <p>
              <strong>Total pagado:</strong> {formatCurrency(completedOrder.total)}
            </p>
            <p>
              <strong>Fecha:</strong> {new Date(completedOrder.paidAt).toLocaleString("es-PE")}
            </p>
          </div>
          <Button type="button" onClick={onRestartFlow}>
            Nueva compra
          </Button>
        </div>
      )}
    </Card>
  );
};
