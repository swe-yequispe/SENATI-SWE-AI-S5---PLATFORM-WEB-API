import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { StorefrontProvider } from "./storefront/context";

vi.mock("./services/store.api", () => ({
  fetchProductsApi: vi.fn(async () => [
    {
      id: "1",
      sku: "SKU-1",
      name: "Mouse Gamer RGB Pro",
      description: "Sensor de alta precision",
      category: "pc",
      price: 39.9,
      rating: 4.5,
      image: "https://example.com/product.jpg",
    },
  ]),
  createOrderApi: vi.fn(async () => ({
    orderId: 1,
    paymentReference: "PAY-001",
    amount: 39.9,
    status: "requires_confirmation",
  })),
  confirmPaymentApi: vi.fn(async () => ({
    orderId: 1,
    status: "paid",
    message: "Compra confirmada correctamente",
    paymentReference: "PAY-001",
    paidAt: new Date().toISOString(),
  })),
}));

describe("Tienda virtual App", () => {
  it("renderiza el titulo principal", () => {
    render(
      <StorefrontProvider>
        <App />
      </StorefrontProvider>,
    );

    expect(screen.getByText("Componentes y accesorios para tu setup profesional")).toBeInTheDocument();
  });

  it("agrega un producto al carrito", async () => {
    render(
      <StorefrontProvider>
        <App />
      </StorefrontProvider>,
    );

    const buttons = await screen.findAllByRole("button", { name: "Agregar" });
    fireEvent.click(buttons[0]);

    const cartIcons = screen.getAllByLabelText("Carrito");
    expect(cartIcons.some((icon) => icon.textContent?.includes("1"))).toBe(true);
  });
});
