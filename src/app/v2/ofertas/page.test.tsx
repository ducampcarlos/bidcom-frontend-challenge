import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import OfertasV2Page from "@/app/v2/ofertas/page";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

const bestOffer = {
  id: 1,
  sku: "SKU-1",
  title: "Best Offer",
  price: 25,
  category: "misc",
  thumbnail: "https://cdn.dummyjson.com/product-images/misc/thumbnail.webp",
  description: "",
  discountPercentage: 40,
};

function mockFetch(products: unknown[], onUrl?: (url: string) => void) {
  global.fetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
    const url = input.toString();
    onUrl?.(url);
    if (url.includes("/products/category-list")) {
      return Promise.resolve({ ok: true, json: async () => ["beauty", "fragrances"] });
    }
    return Promise.resolve({
      ok: true,
      json: async () => ({ products, total: products.length, skip: 0, limit: 20 }),
    });
  }) as unknown as typeof fetch;
}

describe("OfertasV2Page (integration)", () => {
  it("fetches the listing sorted best-discount-first and renders it", async () => {
    const calledUrls: string[] = [];
    mockFetch([bestOffer], (url) => calledUrls.push(url));

    const jsx = await OfertasV2Page();
    render(jsx);

    expect(screen.getByText("Las mejores ofertas")).toBeInTheDocument();
    expect(await screen.findByText("Best Offer")).toBeInTheDocument();
    expect(
      calledUrls.some((url) => url.includes("sortBy=discountPercentage") && url.includes("order=desc")),
    ).toBe(true);
  });

  it("renders the empty state when there are no offers", async () => {
    mockFetch([]);

    const jsx = await OfertasV2Page();
    render(jsx);

    expect(
      screen.getByText("No se encontró ningún producto. Te recomendamos buscar estas categorías"),
    ).toBeInTheDocument();
  });
});
