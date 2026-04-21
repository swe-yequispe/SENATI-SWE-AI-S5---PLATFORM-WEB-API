import { Badge } from "./ui";

interface NavbarProps {
  cartCount: number;
}

export const Navbar = ({ cartCount }: NavbarProps): JSX.Element => {
  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">TechStore</p>
          <p className="text-sm font-semibold text-slate-900">Accesorios para PC, laptops y celulares</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="#catalogo" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Catalogo
          </a>
          <a href="#checkout" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Checkout
          </a>
          <Badge>{cartCount} items</Badge>
        </div>
      </div>
    </nav>
  );
};
