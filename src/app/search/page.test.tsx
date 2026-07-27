import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SearchPage from "@/app/search/page";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("SearchPage (integration)", () => {
  it("renders matching products for a query with results", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        products: [
          {
            id: 1,
            sku: "SKU-1",
            title: "Found Product",
            price: 12.5,
            category: "misc",
            thumbnail: "https://cdn.dummyjson.com/product-images/misc/thumbnail.webp",
            images: [],
            description: "",
          },
        ],
        total: 1,
        skip: 0,
        limit: 20,
      }),
    }) as unknown as typeof fetch;

    const jsx = await SearchPage({ searchParams: Promise.resolve({ s: "found" }) });
    render(jsx);

    expect(await screen.findByText("Found Product")).toBeInTheDocument();
  });

  it("renders the empty state with categories when there are no matches", async () => {
    global.fetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.includes("/products/search")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ products: [], total: 0, skip: 0, limit: 20 }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ["beauty", "fragrances", "furniture", "groceries", "home-decoration"],
      });
    }) as unknown as typeof fetch;

    const jsx = await SearchPage({ searchParams: Promise.resolve({ s: "zzz" }) });
    render(jsx);

    expect(
      await screen.findByText(
        "No se encontró ningún producto. Te recomendamos buscar estas categorías",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "beauty" })).toBeInTheDocument();
  });
});
