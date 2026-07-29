import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HeaderV2 } from "@/components/v2/HeaderV2";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("HeaderV2", () => {
  it("links the logo to /v2 and renders the search bar", () => {
    render(<HeaderV2 />);

    const homeLink = screen.getByRole("link", { name: "Ir al inicio de Bidcom v2" });
    expect(homeLink).toHaveAttribute("href", "/v2");
    expect(screen.getByText("Bidcom")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Buscar productos" })).toBeInTheDocument();
  });

  it("links back to the classic version", () => {
    render(<HeaderV2 />);

    expect(screen.getByRole("link", { name: "Versión clásica" })).toHaveAttribute("href", "/");
  });
});
