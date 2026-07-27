import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductGrid } from "@/components/product/ProductGrid";
import { mockProduct } from "@/test/fixtures";

describe("ProductGrid", () => {
  it("renders one link per product pointing to its sku route", () => {
    const products = [mockProduct, { ...mockProduct, id: 2, sku: "SKU-2", title: "Second" }];
    render(<ProductGrid products={products} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", `/product/${mockProduct.sku}`);
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
