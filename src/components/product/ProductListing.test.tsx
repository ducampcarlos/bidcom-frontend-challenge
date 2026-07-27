import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductListing } from "@/components/product/ProductListing";
import { mockProduct } from "@/test/fixtures";

describe("ProductListing", () => {
  it("renders the product grid when there are products", () => {
    render(<ProductListing products={[mockProduct]} emptyStateCategories={[]} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", `/product/${mockProduct.sku}`);
  });

  it("renders the empty state with categories when there are no products", () => {
    render(<ProductListing products={[]} emptyStateCategories={["beauty"]} />);
    expect(screen.getByText(/No se encontró ningún producto/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "beauty" })).toBeInTheDocument();
  });
});
