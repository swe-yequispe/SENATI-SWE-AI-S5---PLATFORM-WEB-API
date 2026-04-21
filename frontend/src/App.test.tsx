import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("Tienda virtual App", () => {
  it("renderiza el titulo principal", () => {
    render(<App />);
    expect(screen.getByText("Tienda virtual de accesorios tech")).toBeInTheDocument();
  });

  it("agrega un producto al carrito", () => {
    render(<App />);

    const firstAddButton = screen.getAllByRole("button", { name: "Agregar al carrito" })[0];
    fireEvent.click(firstAddButton);

    expect(screen.getByText("1 productos")).toBeInTheDocument();
  });
});
