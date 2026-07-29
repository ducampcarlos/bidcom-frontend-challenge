import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCardV2 } from "@/components/v2/ProductCardV2";
import { mockProduct } from "@/test/fixtures";

describe("ProductCardV2", () => {
  it("links to the v2 product route", () => {
    render(<ProductCardV2 product={mockProduct} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", `/v2/product/${mockProduct.sku}`);
  });

  it("shows brand and rating when present", () => {
    render(<ProductCardV2 product={{ ...mockProduct, brand: "Essence", rating: 4.567 }} />);

    expect(screen.getByText("Essence")).toBeInTheDocument();
    expect(screen.getByText("4.6")).toBeInTheDocument();
  });

  it("omits brand and rating when absent", () => {
    render(<ProductCardV2 product={mockProduct} />);

    expect(screen.queryByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.queryByText(/^\d\.\d$/)).not.toBeInTheDocument();
  });

  it("shows a discount badge and the original strikethrough price when discounted", () => {
    render(<ProductCardV2 product={{ ...mockProduct, price: 90, discountPercentage: 10 }} />);

    expect(screen.getByText("-10%")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("$90.00")).toBeInTheDocument();
  });

  it("shows no discount badge or strikethrough price when discountPercentage is absent", () => {
    render(<ProductCardV2 product={mockProduct} />);

    expect(screen.queryByText(/^-\d+%$/)).not.toBeInTheDocument();
  });

  it("treats a zero or negative discountPercentage as no discount", () => {
    render(<ProductCardV2 product={{ ...mockProduct, discountPercentage: 0 }} />);

    expect(screen.queryByText(/^-\d+%$/)).not.toBeInTheDocument();
  });
});
