import { Link, NavLink } from "react-router-dom";

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
}

const offerAlerts = [
  {
    title: "Mouse Gamer RGB Pro",
    subtitle: "Oferta flash por tiempo limitado",
    link: "/catalog?section=gaming&q=mouse&sort=price-asc",
  },
  {
    title: "Smart TV 55 4K",
    subtitle: "Descuento exclusivo en hogar",
    link: "/catalog?section=hogar&category=video&sort=price-asc",
  },
  {
    title: "Tablet 11 Pro",
    subtitle: "Precio especial para estudio y trabajo",
    link: "/catalog?section=profesional&category=tablet&sort=price-asc",
  },
];

const linkClass = ({ isActive }: { isActive: boolean }): string => {
  return `text-sm font-medium ${isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900"}`;
};

export const Navbar = ({ cartCount, wishlistCount }: NavbarProps): JSX.Element => {
  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <img src="/senati_icon.svg.png" alt="Senati Icon" className="h-8 w-8 rounded-xl object-cover" />
          <div>
            <p className="text-lg font-bold leading-none text-blue-700">Senati Tech Solutions</p>
          </div>
        </div>

        <div className="hidden items-center gap-5 lg:flex">
          <NavLink to="/" className={linkClass} end>
            Inicio
          </NavLink>

          <div className="group relative py-2">
            <Link to="/catalog?section=gaming&sort=rating" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Gaming
            </Link>
            <div className="pointer-events-none absolute left-0 top-full z-40 mt-1 w-72 translate-y-1 rounded-2xl border border-slate-200 bg-white p-4 opacity-0 shadow-xl transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Sugerencias Gaming</p>
              <div className="mt-3 grid gap-2">
                <Link
                  to="/catalog?section=gaming&q=mouse&sort=rating"
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Mouse Gamer RGB Pro
                </Link>
                <Link
                  to="/catalog?section=gaming&category=teclado&sort=rating"
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Teclado Mecanico TKL
                </Link>
                <Link
                  to="/catalog?section=gaming&category=audio&sort=rating"
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Audifonos Over Ear Studio
                </Link>
              </div>
            </div>
          </div>

          <div className="group relative py-2">
            <NavLink to="/catalog?section=hogar&sort=price-asc" className={linkClass}>
              Hogar
            </NavLink>
            <div className="pointer-events-none absolute left-0 top-full z-40 mt-1 w-72 translate-y-1 rounded-2xl border border-slate-200 bg-white p-4 opacity-0 shadow-xl transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Sugerencias Hogar</p>
              <div className="mt-3 grid gap-2">
                <Link
                  to="/catalog?section=hogar&category=video&sort=rating"
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Smart TV 55 4K
                </Link>
                <Link
                  to="/catalog?section=hogar&q=proyector&sort=rating"
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Proyector Full HD
                </Link>
                <Link
                  to="/catalog?section=hogar&category=audio&sort=rating"
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Barra de Sonido Compacta
                </Link>
              </div>
            </div>
          </div>

          <div className="group relative py-2">
            <NavLink to="/catalog?section=profesional&sort=rating" className={linkClass}>
              Profesional
            </NavLink>
            <div className="pointer-events-none absolute left-0 top-full z-40 mt-1 w-72 translate-y-1 rounded-2xl border border-slate-200 bg-white p-4 opacity-0 shadow-xl transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                Sugerencias Profesional
              </p>
              <div className="mt-3 grid gap-2">
                <Link
                  to="/catalog?section=profesional&category=laptop&sort=rating"
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Base Refrigerante Dual Fan
                </Link>
                <Link
                  to="/catalog?section=profesional&category=tablet&sort=rating"
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Tablet 11 Pro
                </Link>
                <Link
                  to="/catalog?section=profesional&q=mochila&sort=rating"
                  className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Mochila Ejecutiva 16
                </Link>
              </div>
            </div>
          </div>

          <NavLink to="/contacto" className={linkClass}>
            Contactanos
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <div className="group relative">
            <button type="button" aria-label="Notificaciones" className="relative rounded-xl p-2 text-slate-700 hover:bg-slate-100">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 9a6 6 0 1 1 12 0v4.8l1.6 2.2H4.4L6 13.8V9Z" />
                <path d="M10 18a2 2 0 0 0 4 0" />
              </svg>
              <span className="absolute -right-1 -top-1 rounded-full bg-rose-600 px-1.5 text-[10px] font-bold text-white">
                {offerAlerts.length}
              </span>
            </button>
            <div className="pointer-events-none absolute right-0 top-full z-50 mt-1 w-80 translate-y-1 rounded-2xl border border-slate-200 bg-white p-4 opacity-0 shadow-xl transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">Alertas de ofertas</p>
              <div className="mt-3 grid gap-2">
                {offerAlerts.map((alert) => (
                  <Link key={alert.title} to={alert.link} className="rounded-xl bg-slate-100 px-3 py-2 hover:bg-slate-200">
                    <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
                    <p className="text-xs text-slate-600">{alert.subtitle}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link to="/account" aria-label="Favoritos" className="relative rounded-xl p-2 text-slate-700 hover:bg-slate-100">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 21s-7-4.4-9.2-8.4A5.4 5.4 0 0 1 12 5.6a5.4 5.4 0 0 1 9.2 7c-2.2 4-9.2 8.4-9.2 8.4Z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-slate-900 px-1.5 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" aria-label="Carrito" className="relative rounded-xl p-2 text-slate-700 hover:bg-slate-100">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M3 4h2l2.3 11.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H7" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-blue-700 px-1.5 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/login" aria-label="Login" className="rounded-xl p-2 text-slate-700 hover:bg-slate-100">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-200/70 px-4 py-2 lg:hidden">
        <div className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto">
          <NavLink to="/" className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700" end>
            Inicio
          </NavLink>
          <NavLink to="/catalog?section=gaming&sort=rating" className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
            Gaming
          </NavLink>
          <NavLink to="/catalog?section=hogar&sort=price-asc" className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
            Hogar
          </NavLink>
          <NavLink to="/catalog?section=profesional&sort=rating" className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
            Profesional
          </NavLink>
          <NavLink to="/contacto" className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
            Contactanos
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
