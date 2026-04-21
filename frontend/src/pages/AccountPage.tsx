import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { Alert, Card } from "../components/ui";
import { useStorefront } from "../storefront/context";

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);
};

export const AccountPage = (): JSX.Element => {
  const { wishlistProducts, orderHistory, addToCart, toggleWishlist, isInWishlist } = useStorefront();

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Mi cuenta</p>
        <h1 className="text-3xl font-black text-slate-900">Favoritos y compras</h1>
        <p className="mt-1 text-sm text-slate-600">Administra tus productos guardados y revisa tus ultimas ordenes.</p>
      </header>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-2">
          <h2 className="text-xl font-bold text-slate-900">Favoritos</h2>
          <Link to="/catalog" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
            Agregar mas productos
          </Link>
        </div>

        {wishlistProducts.length === 0 ? (
          <Alert variant="info">No tienes productos guardados. Marca productos con "Guardar" para verlos aqui.</Alert>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
                onToggleWishlist={toggleWishlist}
                isWishlisted={isInWishlist(product.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Historial de pedidos</h2>

        {orderHistory.length === 0 ? (
          <Alert variant="info">Aun no hay compras registradas en esta sesion/localStorage.</Alert>
        ) : (
          <div className="space-y-3">
            {orderHistory.map((order) => (
              <Card key={`${order.orderId}-${order.paymentReference}`} as="article" className="border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">
                    Orden #{order.orderId} - {order.paymentReference}
                  </p>
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(order.total)}</p>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  {new Date(order.paidAt).toLocaleString("es-PE")} | {order.customerName} ({order.customerEmail})
                </p>

                <ul className="mt-3 space-y-1 text-sm text-slate-700">
                  {order.items.map((item) => (
                    <li key={`${order.orderId}-${item.productId}`}>
                      {item.name} x{item.quantity} - {formatCurrency(item.unitPrice * item.quantity)}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </section>
    </section>
  );
};