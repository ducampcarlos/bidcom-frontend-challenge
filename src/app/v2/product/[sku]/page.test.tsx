import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProductV2Page from "@/app/v2/product/[sku]/page";

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

describe("ProductV2Page (integration)", () => {
  it("renders brand, rating and discount details when present", async () => {
    mockCatalog([
      {
        id: 1,
        sku: "BEA-001",
        title: "Essence Mascara",
        price: 90,
        category: "beauty",
        thumbnail: "https://cdn.dummyjson.com/thumb.webp",
        description: "Volumizing mascara.",
        brand: "Essence",
        rating: 4.5,
        discountPercentage: 10,
      },
    ]);

    const jsx = await ProductV2Page({ params: Promise.resolve({ sku: "BEA-001" }) });
    render(jsx);

    expect(screen.getByText("Essence Mascara")).toBeInTheDocument();
    expect(screen.getByText("Essence")).toBeInTheDocument();
    expect(screen.getByText("4.5 de calificación")).toBeInTheDocument();
    expect(screen.getByText("-10%")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("$90.00")).toBeInTheDocument();
    expect(screen.getByText("beauty")).toBeInTheDocument();
  });

  it("renders without brand/rating/discount when they're absent", async () => {
    mockCatalog([
      {
        id: 2,
        sku: "MISC-002",
        title: "Plain Product",
        price: 20,
        category: "misc",
        thumbnail: "https://cdn.dummyjson.com/thumb2.webp",
        description: "No extras.",
      },
    ]);

    const jsx = await ProductV2Page({ params: Promise.resolve({ sku: "MISC-002" }) });
    render(jsx);

    expect(screen.getByText("Plain Product")).toBeInTheDocument();
    expect(screen.queryByText(/de calificación/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^-\d+%$/)).not.toBeInTheDocument();
  });

  it("calls notFound() when no product matches the sku", async () => {
    mockCatalog([]);

    await expect(
      ProductV2Page({ params: Promise.resolve({ sku: "does-not-exist" }) }),
    ).rejects.toThrow();
  });
});
