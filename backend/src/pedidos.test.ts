import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "./app.js";
import { resetPedidosStore } from "./services/pedidos.service.js";

describe("API pedidos", () => {
  beforeEach(() => {
    resetPedidosStore();
  });

  it("crea pedido valido con estado pendiente", async () => {
    const response = await request(app)
      .post("/pedidos")
      .send({ descripcion: "Comprar insumos" });

    expect(response.status).toBe(201);
    expect(response.body.descripcion).toBe("Comprar insumos");
    expect(response.body.estado).toBe("pendiente");
    expect(response.body.id).toBeTypeOf("string");
  });

  it("rechaza pedido con descripcion vacia", async () => {
    const response = await request(app).post("/pedidos").send({ descripcion: "   " });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("obligatoria");
  });

  it("aprueba pedido existente", async () => {
    const creado = await request(app)
      .post("/pedidos")
      .send({ descripcion: "Pedido A" });

    const response = await request(app).put(`/pedidos/${creado.body.id}`).send({});

    expect(response.status).toBe(200);
    expect(response.body.estado).toBe("aprobado");
  });

  it("retorna 404 al aprobar pedido inexistente", async () => {
    const response = await request(app).put("/pedidos/no-existe").send({});

    expect(response.status).toBe(404);
  });

  it("lista pedidos en JSON", async () => {
    await request(app).post("/pedidos").send({ descripcion: "Pedido 1" });
    await request(app).post("/pedidos").send({ descripcion: "Pedido 2" });

    const response = await request(app).get("/pedidos");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
  });
});
