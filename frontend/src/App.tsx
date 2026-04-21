import { useEffect, useMemo, useState } from "react";
import { CategoryFilter } from "./components/CategoryFilter";
import { ProductCard } from "./components/ProductCard";
import { CartPanel } from "./components/CartPanel";
import { Navbar } from "./components/Navbar";
import { Alert, Badge, Card, TextInput } from "./components/ui";
import { PRODUCTS as FALLBACK_PRODUCTS } from "./data/products";
import { confirmPaymentApi, createOrderApi, fetchProductsApi } from "./services/store.api";
import type { CartLine, Product, ProductCategory } from "./types/store";

const CART_STORAGE_KEY = "tech-store-cart-v1";

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

const categoryOptions: Array<{ value: "all" | ProductCategory; label: string }> = [
  { value: "all", label: "Todo" },
  { value: "pc", label: "PC" },
  { value: "laptop", label: "Laptops" },
  { value: "celular", label: "Celulares" },
  { value: "teclado", label: "Teclados" },
  { value: "audio", label: "Audio" },
];

const initialCustomerData: CustomerData = {
  fullName: "",
  email: "",
  phone: "",
  document: "",
  address: "",
};

const initialPaymentData: PaymentData = {
  cardHolder: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

const isExpiryValid = (value: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(value)) {
    return false;
  }

  const [monthText, yearText] = value.split("/");
  const month = Number(monthText);
  const year = 2000 + Number(yearText);

  if (month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return year > currentYear || (year === currentYear && month >= currentMonth);
};

export const App = (): JSX.Element => {
  const [dataSource, setDataSource] = useState<"api" | "local">("api");
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | ProductCategory>("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [customerData, setCustomerData] = useState<CustomerData>(initialCustomerData);
  const [paymentData, setPaymentData] = useState<PaymentData>(initialPaymentData);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

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

    setSelectedMap((current) => {
      const next: Record<string, boolean> = {};

      Object.entries(cart)
        .filter(([, quantity]) => quantity > 0)
        .forEach(([productId]) => {
          next[productId] = current[productId] ?? true;
        });

      return next;
    });
  }, [cart]);

  useEffect(() => {
    const loadProducts = async (): Promise<void> => {
      try {
        setErrorMessage(null);
        const data = await fetchProductsApi();

        const source = data.length > 0 ? data : FALLBACK_PRODUCTS;
        const deduped = Array.from(new Map(source.map((product) => [product.id, product])).values());
        setProducts(deduped);

        if (data.length === 0) {
          setDataSource("local");
          setErrorMessage("La API no devolvio productos. Mostrando catalogo local de respaldo.");
        } else {
          setDataSource("api");
        }
      } catch (error) {
        const deduped = Array.from(
          new Map(FALLBACK_PRODUCTS.map((product) => [product.id, product])).values(),
        );
        setProducts(deduped);
        setDataSource("local");
        setErrorMessage(
          `No se pudo conectar a la API (${(error as Error).message}). Mostrando catalogo local.`,
        );
      } finally {
        setIsProductsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchCategory = category === "all" || product.category === category;
      const matchQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchCategory && matchQuery;
    });
  }, [products, search, category]);

  const cartLines = useMemo<CartLine[]>(() => {
    return Object.entries(cart)
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = products.find((item) => item.id === productId);
        return product ? { product, quantity } : null;
      })
      .filter((line): line is CartLine => line !== null);
  }, [cart, products]);

  const selectedLines = useMemo(() => {
    return cartLines.filter((line) => selectedMap[line.product.id]);
  }, [cartLines, selectedMap]);

  const itemCount = useMemo(() => {
    return cartLines.reduce((acc, line) => acc + line.quantity, 0);
  }, [cartLines]);

  const selectedCount = useMemo(() => {
    return selectedLines.reduce((acc, line) => acc + line.quantity, 0);
  }, [selectedLines]);

  const subtotal = useMemo(() => {
    return selectedLines.reduce((acc, line) => acc + line.product.price * line.quantity, 0);
  }, [selectedLines]);

  const shipping = subtotal === 0 || subtotal >= 250 ? 0 : 15;
  const total = subtotal + shipping;

  const addToCart = (productId: string): void => {
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
    setFormError(null);
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
    setSelectedMap({});
    setCheckoutStep("cart");
    setFormError(null);
  };

  const toggleSelect = (productId: string): void => {
    setSelectedMap((current) => ({ ...current, [productId]: !current[productId] }));
  };

  const validateCustomerData = (): string | null => {
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{5,80}$/.test(customerData.fullName.trim())) {
      return "Nombre invalido: usa solo letras y espacios (minimo 5 caracteres).";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email.trim())) {
      return "Email invalido.";
    }

    if (!/^9\d{8}$/.test(customerData.phone.trim())) {
      return "Celular invalido: debe tener 9 digitos y comenzar en 9.";
    }

    if (!/^\d{8}$/.test(customerData.document.trim())) {
      return "DNI invalido: debe tener 8 digitos.";
    }

    if (customerData.address.trim().length < 10) {
      return "Direccion invalida: minimo 10 caracteres.";
    }

    return null;
  };

  const validatePaymentData = (): string | null => {
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{5,80}$/.test(paymentData.cardHolder.trim())) {
      return "Titular de tarjeta invalido.";
    }

    const digits = paymentData.cardNumber.replace(/\s/g, "");
    if (!/^\d{16}$/.test(digits)) {
      return "Numero de tarjeta invalido: deben ser 16 digitos.";
    }

    if (!isExpiryValid(paymentData.expiry.trim())) {
      return "Fecha de vencimiento invalida (MM/YY y no vencida).";
    }

    if (!/^\d{3}$/.test(paymentData.cvv.trim())) {
      return "CVV invalido: deben ser 3 digitos.";
    }

    return null;
  };

  const continueFromCart = (): void => {
    if (selectedCount <= 0) {
      setFormError("Selecciona al menos un producto para continuar.");
      return;
    }

    setFormError(null);
    setCheckoutStep("customer");
  };

  const continueFromCustomer = (): void => {
    const error = validateCustomerData();
    if (error) {
      setFormError(error);
      return;
    }

    setFormError(null);
    setCheckoutStep("payment");
  };

  const confirmPurchase = async (): Promise<void> => {
    const paymentError = validatePaymentData();
    if (paymentError) {
      setFormError(paymentError);
      return;
    }

    if (!selectedLines.length) {
      setFormError("No hay productos seleccionados para comprar.");
      setCheckoutStep("cart");
      return;
    }

    try {
      setFormError(null);
      setIsSubmitting(true);

      const order = await createOrderApi({
        customerName: customerData.fullName.trim(),
        customerEmail: customerData.email.trim().toLowerCase(),
        items: selectedLines.map((line) => ({ productId: line.product.id, quantity: line.quantity })),
      });

      const confirmed = await confirmPaymentApi(order.orderId, order.paymentReference);

      setCompletedOrder({
        orderId: confirmed.orderId,
        paymentReference: confirmed.paymentReference,
        paidAt: confirmed.paidAt,
        total,
      });

      setCart((current) => {
        const next = { ...current };
        selectedLines.forEach((line) => {
          delete next[line.product.id];
        });
        return next;
      });

      setCheckoutStep("success");
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const restartFlow = (): void => {
    setCheckoutStep("cart");
    setCompletedOrder(null);
    setCustomerData(initialCustomerData);
    setPaymentData(initialPaymentData);
    setFormError(null);
  };

  return (
    <>
      <Navbar cartCount={itemCount} />
      <main className="app-bg min-h-screen p-4 sm:p-8">
        <section className="mx-auto w-full max-w-7xl space-y-5">
          <header className="glass-panel p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Storefront</p>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-4xl">Tienda virtual de accesorios tech</h1>
                <p className="mt-1 text-sm text-slate-600">
                  Catalogo real con pedidos en MySQL, pago simulado y confirmacion de compra.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={dataSource === "api" ? "success" : "warning"}>
                  {dataSource === "api" ? "API conectada" : "Modo local"}
                </Badge>
                <Badge className="h-fit">{itemCount} items en carrito</Badge>
              </div>
            </div>
          </header>

          {errorMessage && <Alert variant="error">{errorMessage}</Alert>}

          <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
            <div id="catalogo" className="space-y-4">
              <Card as="section" className="space-y-4 border-slate-200 bg-white p-5">
                <TextInput
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar: mouse, teclado, USB-C..."
                  aria-label="Buscar productos"
                />
                <CategoryFilter selected={category} categories={categoryOptions} onSelect={setCategory} />
              </Card>

              {isProductsLoading ? (
                <Alert variant="info">Cargando productos...</Alert>
              ) : filteredProducts.length === 0 ? (
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
              selectedMap={selectedMap}
              selectedCount={selectedCount}
              itemCount={itemCount}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              checkoutStep={checkoutStep}
              customerData={customerData}
              paymentData={paymentData}
              completedOrder={completedOrder}
              isSubmitting={isSubmitting}
              formError={formError}
              onToggleSelect={toggleSelect}
              onIncrease={increase}
              onDecrease={decrease}
              onRemove={remove}
              onClear={clear}
              onCustomerChange={(field, value) => {
                setCustomerData((current) => ({ ...current, [field]: value }));
                setFormError(null);
              }}
              onPaymentChange={(field, value) => {
                if (field === "cardNumber") {
                  setPaymentData((current) => ({ ...current, cardNumber: formatCardNumber(value) }));
                } else if (field === "expiry") {
                  const digits = value.replace(/\D/g, "").slice(0, 4);
                  const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                  setPaymentData((current) => ({ ...current, expiry: formatted }));
                } else {
                  setPaymentData((current) => ({ ...current, [field]: value }));
                }
                setFormError(null);
              }}
              onContinueFromCart={continueFromCart}
              onBackToCart={() => {
                setCheckoutStep("cart");
                setFormError(null);
              }}
              onContinueFromCustomer={continueFromCustomer}
              onBackToCustomer={() => {
                setCheckoutStep("customer");
                setFormError(null);
              }}
              onConfirmPurchase={() => void confirmPurchase()}
              onRestartFlow={restartFlow}
            />
          </section>
        </section>
      </main>
    </>
  );
};
