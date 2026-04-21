import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CategoryFilter } from "../components/CategoryFilter";
import { ProductCard } from "../components/ProductCard";
import { Alert, Card, TextInput } from "../components/ui";
import { CATEGORY_OPTIONS, type ProductSort, useStorefront } from "../storefront/context";
import type { ProductCategory } from "../types/store";

const parseCategory = (value: string | null): "all" | ProductCategory => {
  const valid: Array<"all" | ProductCategory> = ["all", "pc", "laptop", "celular", "tablet", "video", "teclado", "audio"];
  return value && valid.includes(value as "all" | ProductCategory) ? (value as "all" | ProductCategory) : "all";
};

const parseSort = (value: string | null): ProductSort => {
  const valid: ProductSort[] = ["featured", "price-asc", "price-desc", "rating"];
  return value && valid.includes(value as ProductSort) ? (value as ProductSort) : "featured";
};

type CatalogSection = "gaming" | "hogar" | "profesional";

const parseSection = (value: string | null): CatalogSection | null => {
  const valid: CatalogSection[] = ["gaming", "hogar", "profesional"];
  return value && valid.includes(value as CatalogSection) ? (value as CatalogSection) : null;
};

const sectionCategories: Record<CatalogSection, ProductCategory[]> = {
  gaming: ["pc", "teclado", "audio"],
  hogar: ["video", "audio", "celular"],
  profesional: ["laptop", "tablet", "pc"],
};

const sectionLabel: Record<CatalogSection, string> = {
  gaming: "Gaming",
  hogar: "Hogar",
  profesional: "Profesional",
};

const sortProducts = <T extends { price: number; rating: number }>(sortBy: ProductSort, products: T[]): T[] => {
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

export const CatalogPage = (): JSX.Element => {
  const { products, addToCart, isProductsLoading, toggleWishlist, isInWishlist } = useStorefront();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const category = parseCategory(searchParams.get("category"));
  const sortBy = parseSort(searchParams.get("sort"));
  const section = parseSection(searchParams.get("section"));

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    let scopedProducts = products;
    if (section) {
      const allowed = sectionCategories[section];
      scopedProducts = scopedProducts.filter((product) => allowed.includes(product.category));
    }

    if (category !== "all") {
      scopedProducts = scopedProducts.filter((product) => product.category === category);
    }

    if (query) {
      scopedProducts = scopedProducts.filter((product) => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query)
        );
      });
    }

    return sortProducts(sortBy, scopedProducts);
  }, [products, section, category, search, sortBy]);

  const updateParam = (key: string, value: string): void => {
    const next = new URLSearchParams(searchParams);

    if (!value || value === "all" || value === "featured") {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setSearchParams(next);
  };

  return (
    <section id="catalogo" className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Catalogo</p>
          <h1 className="text-3xl font-black text-slate-900">
            {section ? `Productos ${sectionLabel[section]}` : "Todos los productos"}
          </h1>
        </div>
        <Link to="/cart" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
          Ir a checkout
        </Link>
      </header>

      <Card as="section" className="space-y-4 border-slate-200 bg-white p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <TextInput
            value={search}
            onChange={(event) => updateParam("q", event.target.value)}
            placeholder="Buscar por nombre, descripcion o SKU..."
            aria-label="Buscar productos"
          />
          <select
            aria-label="Ordenar productos"
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

        <CategoryFilter selected={category} categories={CATEGORY_OPTIONS} onSelect={(value) => updateParam("category", value)} />
        <p className="text-sm text-slate-500">{filteredProducts.length} productos en resultado</p>
      </Card>

      {isProductsLoading ? (
        <Alert variant="info">Cargando productos...</Alert>
      ) : filteredProducts.length === 0 ? (
        <Alert variant="info">No encontramos productos con esos filtros.</Alert>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
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
