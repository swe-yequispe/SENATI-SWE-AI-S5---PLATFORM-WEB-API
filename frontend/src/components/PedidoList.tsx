import type { Pedido } from "@pedidos/shared";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";

interface PedidoListProps {
  pedidos: Pedido[];
  onAprobar: (id: string) => Promise<void>;
}

export const PedidoList = ({ pedidos, onAprobar }: PedidoListProps): JSX.Element => {
  if (pedidos.length === 0) {
    return (
      <Card className="border-dashed border-slate-300 bg-white/70 px-4 py-6 text-center text-sm text-slate-600">
        No hay pedidos registrados.
      </Card>
    );
  }

  return (
    <ul className="grid gap-3">
      {pedidos.map((pedido) => {
        const isAprobado = pedido.estado === "aprobado";
        return (
          <Card
            as="li"
            key={pedido.id}
            className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${
              isAprobado
                ? "border-emerald-300 bg-gradient-to-r from-emerald-50 to-white"
                : "border-amber-300 bg-gradient-to-r from-amber-50 to-white"
            }`}
          >
            <div>
              <strong className="block text-sm font-semibold sm:text-base">{pedido.descripcion}</strong>
              <p className="mt-1 text-xs text-slate-600">ID: {pedido.id}</p>
              <Badge className="mt-2" variant={isAprobado ? "success" : "warning"}>
                {pedido.estado}
              </Badge>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => void onAprobar(pedido.id)}
              disabled={isAprobado}
              className="sm:min-w-32"
            >
              {isAprobado ? "Aprobado" : "Aprobar"}
            </Button>
          </Card>
        );
      })}
    </ul>
  );
};

