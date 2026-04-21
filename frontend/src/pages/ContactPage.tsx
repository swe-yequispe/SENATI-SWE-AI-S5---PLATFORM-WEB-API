import { useState, type FormEvent } from "react";
import { Alert, Button, Card, TextInput } from "../components/ui";

interface ContactFormState {
  fullName: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
}

const INITIAL_FORM: ContactFormState = {
  fullName: "",
  email: "",
  phone: "",
  reason: "asesoria",
  message: "",
};

export const ContactPage = (): JSX.Element => {
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsSubmitted(true);
    setForm(INITIAL_FORM);
  };

  return (
    <section className="space-y-5">
      <Card className="border-slate-200 bg-gradient-to-r from-blue-700 to-cyan-600 p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">Atencion al cliente</p>
        <h1 className="mt-2 text-3xl font-bold">Contactanos</h1>
        <p className="mt-2 max-w-2xl text-sm text-blue-100">
          Te ayudamos a elegir equipos de tecnologia, resolver dudas de compra y soporte postventa.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">WhatsApp</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">+51 987 654 321</p>
          <p className="mt-1 text-sm text-slate-600">Respuesta rapida para cotizaciones y estado de pedidos.</p>
        </Card>

        <Card className="border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Correo</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">ventas@techstore.pe</p>
          <p className="mt-1 text-sm text-slate-600">Atendemos consultas comerciales y soporte tecnico.</p>
        </Card>

        <Card className="border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Horario</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Lun a Sab: 9:00 - 19:00</p>
          <p className="mt-1 text-sm text-slate-600">Centro de atencion en Lima, Peru.</p>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Envianos tu consulta</h2>
          <p className="text-sm text-slate-600">Completa el formulario y te responderemos en menos de 24 horas.</p>
        </div>

        {isSubmitted && (
          <Alert variant="success">
            Mensaje enviado correctamente. Nuestro equipo comercial se pondra en contacto contigo.
          </Alert>
        )}

        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Nombres y apellidos</span>
            <TextInput
              required
              value={form.fullName}
              onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
              placeholder="Ingresa tu nombre completo"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Correo</span>
            <TextInput
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="correo@ejemplo.com"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Telefono</span>
            <TextInput
              required
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="987 654 321"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Motivo</span>
            <select
              required
              className="input-base"
              value={form.reason}
              onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
            >
              <option value="asesoria">Asesoria de compra</option>
              <option value="pedido">Seguimiento de pedido</option>
              <option value="garantia">Garantia y devoluciones</option>
              <option value="soporte">Soporte tecnico</option>
            </select>
          </label>

          <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
            <span className="font-medium">Mensaje</span>
            <textarea
              required
              rows={5}
              className="input-base resize-none"
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              placeholder="Cuentanos lo que necesitas y te ayudamos."
            />
          </label>

          <div className="md:col-span-2">
            <Button type="submit">Enviar consulta</Button>
          </div>
        </form>
      </Card>
    </section>
  );
};
