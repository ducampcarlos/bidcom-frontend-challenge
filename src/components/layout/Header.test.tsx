import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Header } from "@/components/layout/Header";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("Header", () => {
  it("links the logo to the home page and renders the search bar", () => {
    render(<Header />);

    const homeLink = screen.getByRole("link", { name: "Ir a la página principal" });
    expect(homeLink).toHaveAttribute("href", "/");
    expect(screen.getByText("Bidcom")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Buscar productos" })).toBeInTheDocument();
  });
});
