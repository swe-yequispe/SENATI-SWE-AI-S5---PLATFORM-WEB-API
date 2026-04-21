import { Link } from "react-router-dom";
import { CartPanel } from "../components/CartPanel";
import { Card } from "../components/ui";
import { useStorefront } from "../storefront/context";

export const CartPage = (): JSX.Element => {
  const storefront = useStorefront();

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <header className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Checkout</p>
          <h1 className="text-3xl font-black text-slate-900">Finaliza tu compra</h1>
          <p className="mt-1 text-sm text-slate-600">
            Completa tu pedido con datos de envio y confirma el pago en pocos pasos.
          </p>
        </header>

        <Card as="section" className="border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Antes de pagar</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>1. Selecciona los productos que deseas comprar.</li>
            <li>2. Completa datos de cliente con informacion valida.</li>
            <li>3. Confirma pago para cerrar la orden.</li>
          </ul>
          <Link to="/catalog" className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:text-blue-800">
            Seguir comprando
          </Link>
        </Card>
      </div>

      <CartPanel
        lines={storefront.cartLines}
        selectedMap={storefront.selectedMap}
        selectedCount={storefront.selectedCount}
        itemCount={storefront.itemCount}
        subtotal={storefront.subtotal}
        shipping={storefront.shipping}
        total={storefront.total}
        checkoutStep={storefront.checkoutStep}
        customerData={storefront.customerData}
        paymentData={storefront.paymentData}
        completedOrder={storefront.completedOrder}
        isSubmitting={storefront.isSubmitting}
        formError={storefront.formError}
        onToggleSelect={storefront.toggleSelect}
        onIncrease={storefront.increase}
        onDecrease={storefront.decrease}
        onRemove={storefront.remove}
        onClear={storefront.clear}
        onCustomerChange={storefront.setCustomerField}
        onPaymentChange={storefront.setPaymentField}
        onContinueFromCart={storefront.continueFromCart}
        onBackToCart={storefront.backToCart}
        onContinueFromCustomer={storefront.continueFromCustomer}
        onBackToCustomer={storefront.backToCustomer}
        onConfirmPurchase={() => void storefront.confirmPurchase()}
        onRestartFlow={storefront.restartFlow}
      />
    </section>
  );
};
