import { Link } from "react-router-dom";
import { Alert, Button, Card, TextInput } from "../components/ui";

export const LoginPage = (): JSX.Element => {
  return (
    <section className="mx-auto w-full max-w-4xl space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Acceso</p>
        <h1 className="text-3xl font-black text-slate-900">Iniciar sesion</h1>
        <p className="mt-1 text-sm text-slate-600">
          Accede a tu cuenta para gestionar pedidos, favoritos y datos de compra.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card as="section" className="border-slate-200 bg-white p-5">
          <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Correo electronico</span>
              <TextInput type="email" placeholder="correo@empresa.com" />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Contrasena</span>
              <TextInput type="password" placeholder="Ingresa tu contrasena" />
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                Recordarme en este equipo
              </label>
              <button type="button" className="font-semibold text-blue-700 hover:text-blue-800">
                Olvide mi contrasena
              </button>
            </div>

            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>
        </Card>

        <Card as="section" className="border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Estado actual</h2>
          <Alert variant="info" className="mt-3">
            Modulo de login en modo visual. No hay autenticacion habilitada por el momento.
          </Alert>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Diseno listo para integrar JWT o session-based auth.</li>
            <li>Preparado para conectar con backend y proveedores OAuth.</li>
            <li>Compatible con flujo de recuperacion de contrasena.</li>
          </ul>
          <Link to="/catalog" className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800">
            Volver al catalogo
          </Link>
        </Card>
      </div>
    </section>
  );
};
