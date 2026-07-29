import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HomeV2Page from "@/app/v2/page";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

const foundProduct = {
  id: 1,
  sku: "SKU-1",
  title: "Found Product",
  price: 12.5,
  category: "misc",
  thumbnail: "https://cdn.dummyjson.com/product-images/misc/thumbnail.webp",
  description: "",
};

const bestOffer = {
  id: 2,
  sku: "SKU-2",
  title: "Best Offer",
  price: 25,
  category: "misc",
  thumbnail: "https://cdn.dummyjson.com/product-images/misc/thumbnail-2.webp",
  description: "",
  discountPercentage: 40,
};

function mockFetch(products: unknown[]) {
  global.fetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
    const url = input.toString();
    if (url.includes("/products/category-list")) {
      return Promise.resolve({ ok: true, json: async () => ["beauty", "fragrances"] });
    }
    if (url.includes("sortBy=discountPercentage")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [bestOffer], total: 1, skip: 0, limit: 6 }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: async () => ({ products, total: products.length, skip: 0, limit: 20 }),
    });
  }) as unknown as typeof fetch;
}

describe("HomeV2Page (integration)", () => {
  it("renders the default product listing", async () => {
    mockFetch([foundProduct]);

    const jsx = await HomeV2Page();
    render(jsx);

    expect(screen.getByText("Todos los productos")).toBeInTheDocument();
    expect(await screen.findByText("Found Product")).toBeInTheDocument();
  });

  it("renders the best-offers section fetched with a discount-desc sort", async () => {
    mockFetch([foundProduct]);

    const jsx = await HomeV2Page();
    render(jsx);

    expect(screen.getByText("Ofertas destacadas")).toBeInTheDocument();
    expect(await screen.findByText("Best Offer")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver productos" })).toHaveAttribute("href", "/v2/ofertas");
  });
});
