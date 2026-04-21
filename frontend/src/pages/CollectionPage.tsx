import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { Alert, Card, TextInput } from "../components/ui";
import { type ProductSort, useStorefront } from "../storefront/context";
import type { ProductCategory } from "../types/store";

const categoryName: Record<ProductCategory, string> = {
  pc: "PC",
  laptop: "Laptops",
  celular: "Celulares",
  tablet: "Tablets",
  video: "Video",
  teclado: "Teclados",
  audio: "Audio",
};

const parseSort = (value: string | null): ProductSort => {
  const valid: ProductSort[] = ["featured", "price-asc", "price-desc", "rating"];
  return value && valid.includes(value as ProductSort) ? (value as ProductSort) : "featured";
};

const isCategory = (value: string | undefined): value is ProductCategory => {
  return ["pc", "laptop", "celular", "tablet", "video", "teclado", "audio"].includes(value ?? "");
};

export const CollectionPage = (): JSX.Element => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getFilteredProducts, addToCart, isProductsLoading, toggleWishlist, isInWishlist } = useStorefront();

  if (!isCategory(category)) {
    return (
      <Alert variant="error">
        Coleccion no valida. <Link to="/catalog" className="font-semibold underline">Volver al catalogo</Link>
      </Alert>
    );
  }

  const search = searchParams.get("q") ?? "";
  const sortBy = parseSort(searchParams.get("sort"));

  const products = useMemo(
    () => getFilteredProducts({ search, category, sortBy }),
    [getFilteredProducts, search, category, sortBy],
  );

  const updateParam = (key: string, value: string): void => {
    const next = new URLSearchParams(searchParams);

    if (!value || value === "featured") {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setSearchParams(next);
  };

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Coleccion</p>
          <h1 className="text-3xl font-black text-slate-900">{categoryName[category]}</h1>
        </div>
        <Link to="/catalog" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
          Ver todo el catalogo
        </Link>
      </header>

      <Card as="section" className="space-y-4 border-slate-200 bg-white p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <TextInput
            value={search}
            onChange={(event) => updateParam("q", event.target.value)}
            placeholder="Buscar dentro de la coleccion"
            aria-label="Buscar en coleccion"
          />
          <select
            aria-label="Ordenar coleccion"
            className="input-base"
            value={sortBy}
            onChange={(event) => updateParam("sort", event.target.value)}
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="rating">Mejor valorados</option>
          </select>
        </div>
        <p className="text-sm text-slate-500">{products.length} productos en esta coleccion</p>
      </Card>

      {isProductsLoading ? (
        <Alert variant="info">Cargando productos...</Alert>
      ) : products.length === 0 ? (
        <Alert variant="info">No hay resultados con esos filtros en esta coleccion.</Alert>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={addToCart}
              onToggleWishlist={toggleWishlist}
              isWishlisted={isInWishlist(product.id)}
            />
          ))}
        </section>
      )}
    </section>
  );
};
