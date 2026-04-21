import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { PRODUCTS as FALLBACK_PRODUCTS } from "../data/products";
import { confirmPaymentApi, createOrderApi, fetchProductsApi } from "../services/store.api";
import type { CartLine, Product, ProductCategory } from "../types/store";

const CART_STORAGE_KEY = "tech-store-cart-v1";
const WISHLIST_STORAGE_KEY = "tech-store-wishlist-v1";
const ORDER_HISTORY_STORAGE_KEY = "tech-store-order-history-v1";

export type CheckoutStep = "cart" | "customer" | "payment" | "success";
export type ProductSort = "featured" | "price-asc" | "price-desc" | "rating";

export interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  document: string;
  address: string;
}

export interface PaymentData {
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

interface OrderHistoryItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderHistoryEntry {
  orderId: number;
  paymentReference: string;
  paidAt: string;
  total: number;
  customerName: string;
  customerEmail: string;
  items: OrderHistoryItem[];
}

interface CollectionItem {
  key: ProductCategory;
  title: string;
  subtitle: string;
  count: number;
  fromPrice: number | null;
}

interface ProductFilter {
  search: string;
  category: "all" | ProductCategory;
  sortBy: ProductSort;
}

interface StorefrontContextValue {
  dataSource: "api" | "local";
  products: Product[];
  isProductsLoading: boolean;
  errorMessage: string | null;
  cartLines: CartLine[];
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
  orderHistory: OrderHistoryEntry[];
  wishlistIds: string[];
  wishlistProducts: Product[];
  isSubmitting: boolean;
  formError: string | null;
  collectionItems: CollectionItem[];
  getFilteredProducts: (filter: ProductFilter) => Product[];
  addToCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  increase: (productId: string) => void;
  decrease: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  toggleSelect: (productId: string) => void;
  setCustomerField: (field: keyof CustomerData, value: string) => void;
  setPaymentField: (field: keyof PaymentData, value: string) => void;
  continueFromCart: () => void;
  backToCart: () => void;
  continueFromCustomer: () => void;
  backToCustomer: () => void;
  confirmPurchase: () => Promise<void>;
  restartFlow: () => void;
}

const categoryLabel: Record<ProductCategory, string> = {
  pc: "PC",
  laptop: "Laptops",
  celular: "Celulares",
  tablet: "Tablets",
  video: "Video",
  teclado: "Teclados",
  audio: "Audio",
};

const categorySubtitle: Record<ProductCategory, string> = {
  pc: "Setup",
  laptop: "Productividad",
  celular: "Movilidad",
  tablet: "Creatividad",
  video: "Entretenimiento",
  teclado: "Input",
  audio: "Sonido",
};

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

const sortProducts = (products: Product[], sortBy: ProductSort): Product[] => {
  return [...products].sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.price - b.price;
    }

    if (sortBy === "price-desc") {
      return b.price - a.price;
    }

    if (sortBy === "rating") {
      return b.rating - a.rating;
    }

    return b.rating * 100 - b.price - (a.rating * 100 - a.price);
  });
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export const StorefrontProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [dataSource, setDataSource] = useState<"api" | "local">("api");
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [customerData, setCustomerData] = useState<CustomerData>(initialCustomerData);
  const [paymentData, setPaymentData] = useState<PaymentData>(initialPaymentData);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryEntry[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
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
    const rawWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    const rawOrderHistory = localStorage.getItem(ORDER_HISTORY_STORAGE_KEY);

    if (rawWishlist) {
      try {
        const parsed = JSON.parse(rawWishlist) as string[];
        setWishlistIds(Array.isArray(parsed) ? parsed : []);
      } catch {
        setWishlistIds([]);
      }
    }

    if (rawOrderHistory) {
      try {
        const parsed = JSON.parse(rawOrderHistory) as OrderHistoryEntry[];
        setOrderHistory(Array.isArray(parsed) ? parsed : []);
      } catch {
        setOrderHistory([]);
      }
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
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(orderHistory));
  }, [orderHistory]);

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
        const deduped = Array.from(new Map(FALLBACK_PRODUCTS.map((product) => [product.id, product])).values());
        setProducts(deduped);
        setDataSource("local");
        setErrorMessage(`No se pudo conectar a la API (${(error as Error).message}). Mostrando catalogo local.`);
      } finally {
        setIsProductsLoading(false);
      }
    };

    void loadProducts();
  }, []);

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

  const itemCount = useMemo(() => cartLines.reduce((acc, line) => acc + line.quantity, 0), [cartLines]);
  const selectedCount = useMemo(() => selectedLines.reduce((acc, line) => acc + line.quantity, 0), [selectedLines]);
  const subtotal = useMemo(
    () => selectedLines.reduce((acc, line) => acc + line.product.price * line.quantity, 0),
    [selectedLines],
  );

  const shipping = subtotal === 0 || subtotal >= 250 ? 0 : 15;
  const total = subtotal + shipping;

  const collectionItems = useMemo<CollectionItem[]>(() => {
    return (Object.keys(categoryLabel) as ProductCategory[]).map((category) => {
      const categoryProducts = products.filter((product) => product.category === category);
      const fromPrice = categoryProducts.length > 0 ? Math.min(...categoryProducts.map((item) => item.price)) : null;

      return {
        key: category,
        title: categoryLabel[category],
        subtitle: categorySubtitle[category],
        count: categoryProducts.length,
        fromPrice,
      };
    });
  }, [products]);

  const wishlistProducts = useMemo(() => {
    return wishlistIds
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is Product => Boolean(product));
  }, [wishlistIds, products]);

  const getFilteredProducts = (filter: ProductFilter): Product[] => {
    const query = filter.search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchCategory = filter.category === "all" || product.category === filter.category;
      const matchQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query);

      return matchCategory && matchQuery;
    });

    return sortProducts(filtered, filter.sortBy);
  };

  const addToCart = (productId: string): void => {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
    setFormError(null);
  };

  const toggleWishlist = (productId: string): void => {
    setWishlistIds((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }

      return [...current, productId];
    });
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistIds.includes(productId);
  };

  const increase = (productId: string): void => {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }));
  };

  const decrease = (productId: string): void => {
    setCart((current) => {
      const quantity = current[productId] ?? 0;
      if (quantity <= 1) {
        const { [productId]: _removed, ...rest } = current;
        return rest;
      }

      return { ...current, [productId]: quantity - 1 };
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
    if (!/^[A-Za-z ]{5,80}$/.test(customerData.fullName.trim())) {
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
    if (!/^[A-Za-z ]{5,80}$/.test(paymentData.cardHolder.trim())) {
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

  const setCustomerField = (field: keyof CustomerData, value: string): void => {
    setCustomerData((current) => ({ ...current, [field]: value }));
    setFormError(null);
  };

  const setPaymentField = (field: keyof PaymentData, value: string): void => {
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
  };

  const continueFromCart = (): void => {
    if (selectedCount <= 0) {
      setFormError("Selecciona al menos un producto para continuar.");
      return;
    }

    setFormError(null);
    setCheckoutStep("customer");
  };

  const backToCart = (): void => {
    setCheckoutStep("cart");
    setFormError(null);
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

  const backToCustomer = (): void => {
    setCheckoutStep("customer");
    setFormError(null);
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

      setOrderHistory((current) => [
        {
          orderId: confirmed.orderId,
          paymentReference: confirmed.paymentReference,
          paidAt: confirmed.paidAt,
          total,
          customerName: customerData.fullName.trim(),
          customerEmail: customerData.email.trim().toLowerCase(),
          items: selectedLines.map((line) => ({
            productId: line.product.id,
            name: line.product.name,
            quantity: line.quantity,
            unitPrice: line.product.price,
          })),
        },
        ...current,
      ]);

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

  const value: StorefrontContextValue = {
    dataSource,
    products,
    isProductsLoading,
    errorMessage,
    cartLines,
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
    orderHistory,
    wishlistIds,
    wishlistProducts,
    isSubmitting,
    formError,
    collectionItems,
    getFilteredProducts,
    addToCart,
    toggleWishlist,
    isInWishlist,
    increase,
    decrease,
    remove,
    clear,
    toggleSelect,
    setCustomerField,
    setPaymentField,
    continueFromCart,
    backToCart,
    continueFromCustomer,
    backToCustomer,
    confirmPurchase,
    restartFlow,
  };

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>;
};

export const useStorefront = (): StorefrontContextValue => {
  const context = useContext(StorefrontContext);

  if (!context) {
    throw new Error("useStorefront debe usarse dentro de StorefrontProvider");
  }

  return context;
};

export const CATEGORY_OPTIONS: Array<{ value: "all" | ProductCategory; label: string }> = [
  { value: "all", label: "Todo" },
  { value: "pc", label: "PC" },
  { value: "laptop", label: "Laptops" },
  { value: "celular", label: "Celulares" },
  { value: "tablet", label: "Tablets" },
  { value: "video", label: "Video" },
  { value: "teclado", label: "Teclados" },
  { value: "audio", label: "Audio" },
];
