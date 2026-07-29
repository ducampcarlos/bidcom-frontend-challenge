import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OfertasSection } from "@/components/v2/OfertasSection";
import { mockProduct } from "@/test/fixtures";

describe("OfertasSection", () => {
  it("renders nothing when there are no discounted products", () => {
    const { container } = render(<OfertasSection products={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the products and a link to the full offers listing", () => {
    render(<OfertasSection products={[mockProduct]} />);

    expect(screen.getByText("Ofertas destacadas")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver productos" })).toHaveAttribute("href", "/v2/ofertas");
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  });
});
