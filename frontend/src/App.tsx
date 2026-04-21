import { useEffect, useMemo, useState } from "react";
import { CategoryFilter } from "./components/CategoryFilter";
import { ProductCard } from "./components/ProductCard";
import { CartPanel } from "./components/CartPanel";
import { Alert, Badge, Card, TextInput } from "./components/ui";
import { PRODUCTS } from "./data/products";
import type { CartLine, ProductCategory } from "./types/store";

const CART_STORAGE_KEY = "tech-store-cart-v1";

const categoryOptions: Array<{ value: "all" | ProductCategory; label: string }> = [
  { value: "all", label: "Todo" },
  { value: "pc", label: "PC" },
  { value: "laptop", label: "Laptops" },
  { value: "celular", label: "Celulares" },
  { value: "teclado", label: "Teclados" },
  { value: "audio", label: "Audio" },
];

export const App = (): JSX.Element => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | ProductCategory>("all");
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!rawCart) {
      return;
    }

    try {
      const parsed = JSON.parse(rawCart) as Record<string, number>;
      setCart(parsed);
    } catch {
      setCart({});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      const matchCategory = category === "all" || product.category === category;
      const matchQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchCategory && matchQuery;
    });
  }, [search, category]);

  const cartLines = useMemo<CartLine[]>(() => {
    return Object.entries(cart)
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = PRODUCTS.find((item) => item.id === productId);
        return product ? { product, quantity } : null;
      })
      .filter((line): line is CartLine => line !== null);
  }, [cart]);

  const itemCount = useMemo(() => {
    return cartLines.reduce((acc, line) => acc + line.quantity, 0);
  }, [cartLines]);

  const subtotal = useMemo(() => {
    return cartLines.reduce((acc, line) => acc + line.product.price * line.quantity, 0);
  }, [cartLines]);

  const shipping = subtotal === 0 || subtotal >= 250 ? 0 : 15;
  const total = subtotal + shipping;

  const addToCart = (productId: string): void => {
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
  };

  const increase = (productId: string): void => {
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
  };

  const decrease = (productId: string): void => {
    setCart((current) => {
      const quantity = current[productId] ?? 0;
      if (quantity <= 1) {
        const { [productId]: _removed, ...rest } = current;
        return rest;
      }

      return {
        ...current,
        [productId]: quantity - 1,
      };
    });
  };

  const remove = (productId: string): void => {
    setCart((current) => {
      const { [productId]: _removed, ...rest } = current;
      return rest;
    });
  };

  const clear = (): void => {
    setCart({});
  };

  return (
    <main className="app-bg min-h-screen p-4 sm:p-8">
      <section className="mx-auto w-full max-w-7xl space-y-5">
        <header className="glass-panel p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Storefront</p>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-4xl">Tienda virtual de accesorios tech</h1>
              <p className="mt-1 text-sm text-slate-600">
                Encuentra productos para PC, laptops, celulares, teclados y audio con carrito en tiempo real.
              </p>
            </div>
            <Badge className="h-fit">{itemCount} items en carrito</Badge>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <Card as="section" className="space-y-4 border-slate-200 bg-white p-5">
              <TextInput
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar: mouse, teclado, USB-C..."
                aria-label="Buscar productos"
              />
              <CategoryFilter selected={category} categories={categoryOptions} onSelect={setCategory} />
            </Card>

            {filteredProducts.length === 0 ? (
              <Alert variant="info">
                No encontramos productos con esos filtros. Prueba con otra categoria o palabra clave.
              </Alert>
            ) : (
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAdd={addToCart} />
                ))}
              </section>
            )}
          </div>

          <CartPanel
            lines={cartLines}
            itemCount={itemCount}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            onIncrease={increase}
            onDecrease={decrease}
            onRemove={remove}
            onClear={clear}
          />
        </section>
      </section>
    </main>
  );
};
