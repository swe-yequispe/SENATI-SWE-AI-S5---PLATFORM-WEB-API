import { Link } from "react-router-dom";

interface StoreHeroProps {
  itemCount: number;
}

export const StoreHero = ({ itemCount }: StoreHeroProps): JSX.Element => {
  return (
    <section id="inicio" className="glass-panel overflow-hidden p-6 sm:p-8">
      <div className="space-y-4">
        <img src="/senati_logo.svg.png" alt="Senati Tech Solutions" className="h-12 w-auto object-contain" />
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">Senati Tech Solutions</p>
        <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-5xl">
          Componentes y accesorios para tu setup profesional
        </h1>
        <p className="max-w-xl text-sm text-slate-600 sm:text-base">
          Descubre ofertas en tecnologia, arma tu carrito y recibe tu compra rapido y seguro.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/catalog" className="btn-primary px-5 py-3">
            Explorar catalogo
          </Link>
          <Link to="/cart" className="btn-secondary bg-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-300">
            Ir a checkout
          </Link>
          <Link to="/account" className="btn-secondary px-5 py-3">
            Ver mi cuenta
          </Link>
        </div>
      </div>
    </section>
  );
};
