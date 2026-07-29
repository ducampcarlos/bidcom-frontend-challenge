import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { OfertasCarousel } from "@/components/v2/OfertasCarousel";
import { mockProduct } from "@/test/fixtures";

const products = [
  mockProduct,
  { ...mockProduct, id: 2, sku: "TEST-SKU-002", title: "Second Product" },
];

describe("OfertasCarousel", () => {
  it("renders every product as a card", () => {
    render(<OfertasCarousel products={products} />);

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText("Second Product")).toBeInTheDocument();
  });

  it("scrolls the track forward and backward without crashing when the arrows are clicked", async () => {
    render(<OfertasCarousel products={products} />);

    await userEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    await userEvent.click(screen.getByRole("button", { name: "Anterior" }));

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  });
});
