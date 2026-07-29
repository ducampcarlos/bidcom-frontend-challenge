import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SearchV2Page from "@/app/v2/search/page";

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

function mockDummyJsonFetch(searchTermMatches: boolean) {
  global.fetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
    const url = input.toString();
    if (url.includes("/products/category-list")) {
      return Promise.resolve({ ok: true, json: async () => ["beauty", "fragrances"] });
    }
    if (url.includes("/products/category/")) {
      return Promise.resolve({ ok: true, json: async () => ({ products: [], total: 0 }) });
    }
    return Promise.resolve({
      ok: true,
      json: async () => ({
        products: searchTermMatches ? [foundProduct] : [],
        total: searchTermMatches ? 1 : 0,
        skip: 0,
        limit: 20,
      }),
    });
  }) as unknown as typeof fetch;
}

describe("SearchV2Page (integration)", () => {
  it("renders matching products for a query with results", async () => {
    mockDummyJsonFetch(true);

    const jsx = await SearchV2Page({ searchParams: Promise.resolve({ s: "found" }) });
    render(jsx);

    expect(await screen.findByText("Found Product")).toBeInTheDocument();
  });

  it("renders the empty state with categories when there are no matches", async () => {
    mockDummyJsonFetch(false);

    const jsx = await SearchV2Page({ searchParams: Promise.resolve({ s: "zzz" }) });
    render(jsx);

    expect(
      await screen.findByText(
        "No se encontró ningún producto. Te recomendamos buscar estas categorías",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "beauty" })).toHaveAttribute(
      "href",
      "/v2/search?s=beauty",
    );
  });

  it("uses the first value when the s param is repeated in the URL", async () => {
    mockDummyJsonFetch(true);

    const jsx = await SearchV2Page({ searchParams: Promise.resolve({ s: ["found", "other"] }) });
    render(jsx);

    expect(await screen.findByText("Found Product")).toBeInTheDocument();
  });

  it("defaults to an empty query when the s param is missing", async () => {
    mockDummyJsonFetch(true);

    const jsx = await SearchV2Page({ searchParams: Promise.resolve({}) });
    render(jsx);

    expect(await screen.findByText("Found Product")).toBeInTheDocument();
  });

  it("defaults to an empty query when s resolves to an empty array", async () => {
    mockDummyJsonFetch(true);

    const jsx = await SearchV2Page({ searchParams: Promise.resolve({ s: [] }) });
    render(jsx);

    expect(await screen.findByText("Found Product")).toBeInTheDocument();
  });
});
