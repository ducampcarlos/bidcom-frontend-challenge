import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductGridV2 } from "@/components/v2/ProductGridV2";
import { mockProduct } from "@/test/fixtures";

describe("ProductGridV2", () => {
  it("renders one link per product pointing to its v2 sku route", () => {
    const products = [mockProduct, { ...mockProduct, id: 2, sku: "SKU-2", title: "Second" }];
    render(<ProductGridV2 products={products} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", `/v2/product/${mockProduct.sku}`);
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
