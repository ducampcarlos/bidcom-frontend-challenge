import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProductPage from "@/app/(shop)/product/[sku]/page";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

function mockCatalog(products: unknown[]) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ products, total: products.length, skip: 0, limit: 0 }),
  }) as unknown as typeof fetch;
}

describe("ProductPage (integration)", () => {
  it("renders the product's details when the sku exists", async () => {
    mockCatalog([
      {
        id: 1,
        sku: "BEA-001",
        title: "Essence Mascara",
        price: 9.99,
        category: "beauty",
        thumbnail: "https://cdn.dummyjson.com/thumb.webp",
        description: "Volumizing mascara.",
      },
    ]);

    const jsx = await ProductPage({ params: Promise.resolve({ sku: "BEA-001" }) });
    render(jsx);

    expect(screen.getByText("Essence Mascara")).toBeInTheDocument();
    expect(screen.getByText("$9.99")).toBeInTheDocument();
    expect(screen.getByText("beauty")).toBeInTheDocument();
  });

  it("calls notFound() when no product matches the sku", async () => {
    mockCatalog([]);

    await expect(
      ProductPage({ params: Promise.resolve({ sku: "does-not-exist" }) }),
    ).rejects.toThrow();
  });
});
