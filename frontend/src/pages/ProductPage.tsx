import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { Alert, Badge, Button, Card } from "../components/ui";
import { useStorefront } from "../storefront/context";
import type { ProductCategory } from "../types/store";

const categoryNames: Record<ProductCategory, string> = {
  pc: "PC",
  laptop: "Laptops",
  celular: "Celulares",
  tablet: "Tablets",
  video: "Video",
  teclado: "Teclados",
  audio: "Audio",
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);
};

export const ProductPage = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, getFilteredProducts, toggleWishlist, isInWishlist } = useStorefront();

  const product = products.find((item) => item.id === id);

  const related = useMemo(() => {
    if (!product) {
      return [];
    }

    return getFilteredProducts({ search: "", category: product.category, sortBy: "rating" })
      .filter((item) => item.id !== product.id)
      .slice(0, 3);
  }, [product, getFilteredProducts]);

  if (!product) {
    return (
      <Alert variant="error">
        Producto no encontrado. <Link to="/catalog" className="font-semibold underline">Volver al catalogo</Link>
      </Alert>
    );
  }

  return (
    <section className="space-y-5">
      <button type="button" onClick={() => navigate(-1)} className="text-sm font-semibold text-slate-600 hover:text-slate-900">
        Volver
      </button>

      <Card as="article" className="overflow-hidden border-slate-200 bg-white p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <img src={product.image} alt={product.name} className="h-72 w-full rounded-2xl object-cover sm:h-96" />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge>{categoryNames[product.category]}</Badge>
              <span className="text-xs font-semibold text-amber-700">{product.rating.toFixed(1)} / 5</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">{product.name}</h1>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-slate-500">SKU {product.sku}</p>
            <p className="text-base text-slate-600">{product.description}</p>
            <p className="text-3xl font-black text-slate-900">{formatCurrency(product.price)}</p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => addToCart(product.id)}>Agregar al carrito</Button>
              <Button
                variant="secondary"
                onClick={() => toggleWishlist(product.id)}
                className={isInWishlist(product.id) ? "bg-rose-600 hover:bg-rose-700" : ""}
              >
                {isInWishlist(product.id) ? "En favoritos" : "Guardar en favoritos"}
              </Button>
              <Link to={`/catalog?category=${product.category}`} className="btn-secondary bg-slate-200 text-slate-700 hover:bg-slate-300">
                Ver categoria
              </Link>
            </div>
          </div>
        </div>
      </Card>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Tambien te puede interesar</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {related.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAdd={addToCart}
              onToggleWishlist={toggleWishlist}
              isWishlisted={isInWishlist(item.id)}
            />
          ))}
        </div>
      </section>
    </section>
  );
};
