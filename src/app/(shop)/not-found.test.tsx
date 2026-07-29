import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "@/app/(shop)/not-found";

describe("(shop) NotFound re-export", () => {
  it("renders the shared not-found UI", () => {
    render(<NotFound />);

    expect(screen.getByText("Producto no encontrado")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/");
  });
});
