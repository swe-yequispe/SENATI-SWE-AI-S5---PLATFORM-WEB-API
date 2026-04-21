import { Link } from "react-router-dom";

export const Footer = (): JSX.Element => {
  return (
    <footer id="contacto" className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-8 lg:grid-cols-4">
        <section>
          <img src="/senati_logo.svg.png" alt="Senati Tech Solutions" className="h-10 w-auto object-contain" />
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">Senati Tech Solutions</p>
          <p className="mt-3 text-sm text-slate-300">
            Ecommerce especializado en tecnologia, accesorios y entretenimiento digital para hogar y oficina.
          </p>
          <p className="mt-3 text-xs text-slate-400">RUC 20456789012</p>
        </section>

        <section>
          <h3 className="text-sm font-bold text-white">Categorias</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><Link to="/collections/celular" className="hover:text-white">Celulares</Link></li>
            <li><Link to="/collections/tablet" className="hover:text-white">Tablets</Link></li>
            <li><Link to="/collections/audio" className="hover:text-white">Audio</Link></li>
            <li><Link to="/collections/video" className="hover:text-white">Video</Link></li>
          </ul>
        </section>

        <section>
          <h3 className="text-sm font-bold text-white">Servicio al cliente</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li><Link to="/account" className="hover:text-white">Mi cuenta</Link></li>
            <li><Link to="/cart" className="hover:text-white">Estado de compra</Link></li>
            <li><span>Cambios y devoluciones: hasta 7 dias</span></li>
            <li><span>Garantia oficial en productos seleccionados</span></li>
          </ul>
        </section>

        <section>
          <h3 className="text-sm font-bold text-white">Contacto</h3>
          <p className="mt-3 text-sm text-slate-300">ventas@techstore.pe</p>
          <p className="text-sm text-slate-300">+51 987 654 321</p>
          <p className="text-sm text-slate-300">Lima, Peru</p>
          <p className="mt-3 text-xs text-slate-400">Atencion: Lun - Sab | 9:00 - 19:00</p>
        </section>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-slate-400 sm:px-8">
          <p>(c) {new Date().getFullYear()} Senati Tech Solutions. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Pagos seguros</span>
            <span>Envio nacional</span>
            <span>Soporte postventa</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
