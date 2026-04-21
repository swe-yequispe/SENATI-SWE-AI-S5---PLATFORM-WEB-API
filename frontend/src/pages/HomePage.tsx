import { Alert, Card } from "../components/ui";
import { ProductCard } from "../components/ProductCard";
import { StoreHero } from "../components/StoreHero";
import { useStorefront } from "../storefront/context";

const TESTIMONIALS = [
  {
    name: "Diego Ramirez",
    role: "Analista de sistemas",
    location: "Lima",
    purchase: "Setup gaming",
    text: "Compre mi setup completo y llego rapido. La calidad supero lo esperado.",
  },
  {
    name: "Mariana Torres",
    role: "Arquitecta",
    location: "Trujillo",
    purchase: "Tablet y accesorios",
    text: "El soporte fue claro y rapido. Productos originales y excelente seguimiento.",
  },
  {
    name: "Jose Castillo",
    role: "Docente universitario",
    location: "Arequipa",
    purchase: "Audio y video",
    text: "Aproveche ofertas reales y la entrega fue puntual. Muy buena experiencia de compra.",
  },
];

export const HomePage = (): JSX.Element => {
  const { itemCount, errorMessage, isProductsLoading, getFilteredProducts, addToCart, toggleWishlist, isInWishlist } =
    useStorefront();

  const featuredProducts = getFilteredProducts({ search: "", category: "all", sortBy: "featured" }).slice(0, 8);
  const offerProducts = getFilteredProducts({ search: "", category: "all", sortBy: "price-asc" }).slice(0, 4);
  const offerProductsLoop = [...offerProducts, ...offerProducts];

  return (
    <section className="space-y-5">
      <StoreHero itemCount={itemCount} />

      {errorMessage && <Alert variant="info">Estamos actualizando el catalogo. Sigue comprando con normalidad.</Alert>}

      <section className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Ofertas del dia</p>
          <h2 className="text-2xl font-bold text-slate-900">Productos en oferta</h2>
        </div>
        <div className="offer-marquee">
          <div className="offer-marquee-track">
            {offerProductsLoop.map((product, index) => (
              <div key={`${product.id}-${index}`} className="offer-marquee-item">
                <ProductCard
                  product={product}
                  onAdd={addToCart}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isInWishlist(product.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Destacados</p>
          <h2 className="text-2xl font-bold text-slate-900">Productos mas destacados</h2>
        </div>

        {isProductsLoading ? (
          <Alert variant="info">Cargando productos...</Alert>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
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
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Clientes satisfechos</p>
          <h2 className="text-2xl font-bold text-slate-900">Opiniones reales de compradores</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <Card key={testimonial.name} as="article" className="border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {testimonial.name
                      .split(" ")
                      .map((value) => value[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">
                      {testimonial.role} - {testimonial.location}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <path d="M12 3l7 4v5c0 4.1-2.6 7.8-7 9-4.4-1.2-7-4.9-7-9V7l7-4Z" />
                  </svg>
                  Compra verificada
                </span>
              </div>

              <div className="mt-4 flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg key={`${testimonial.name}-star-${index}`} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="m12 17.27 5.18 3.14-1.64-5.9L20.5 10l-6-.5L12 4l-2.5 5.5-6 .5 4.96 4.51-1.64 5.9z" />
                  </svg>
                ))}
                <span className="ml-1 text-xs font-semibold text-amber-600">5.0</span>
              </div>

              <p className="mt-3 text-sm text-slate-600">"{testimonial.text}"</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                Compra: {testimonial.purchase}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </section>
  );
};

