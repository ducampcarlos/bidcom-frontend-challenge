import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/v2/search/route";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

const phoneProduct = {
  id: 1,
  sku: "PHN-001",
  title: "Phone",
  price: 499,
  category: "smartphones",
  thumbnail: "https://cdn.dummyjson.com/thumb.webp",
  description: "",
};

function mockFetch(products: unknown[], total = products.length) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ products, total, skip: 0, limit: 20 }),
  }) as unknown as typeof fetch;
}

describe("GET /api/v2/search", () => {
  it("returns matching products for a query", async () => {
    mockFetch([phoneProduct]);

    const request = new NextRequest("http://localhost/api/v2/search?s=phone&limit=6");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.products).toHaveLength(1);
    expect(body.products[0].title).toBe("Phone");
    expect(body.total).toBe(1);
  });

  it("defaults to an empty query and the default limit when none is given", async () => {
    const calledUrls: string[] = [];
    global.fetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
      calledUrls.push(input.toString());
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [], total: 0, skip: 0, limit: 12 }),
      });
    }) as unknown as typeof fetch;

    const request = new NextRequest("http://localhost/api/v2/search");
    await GET(request);

    expect(calledUrls.some((url) => url.includes("limit=12"))).toBe(true);
  });

  it("clamps an out-of-range limit instead of forwarding it as-is", async () => {
    const calledUrls: string[] = [];
    global.fetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
      calledUrls.push(input.toString());
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [], total: 0, skip: 0, limit: 100 }),
      });
    }) as unknown as typeof fetch;

    const request = new NextRequest("http://localhost/api/v2/search?limit=99999");
    await GET(request);

    expect(calledUrls.some((url) => url.includes("limit=100"))).toBe(true);
  });

  it("falls back to the default limit when limit isn't a number", async () => {
    const calledUrls: string[] = [];
    global.fetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
      calledUrls.push(input.toString());
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [], total: 0, skip: 0, limit: 12 }),
      });
    }) as unknown as typeof fetch;

    const request = new NextRequest("http://localhost/api/v2/search?limit=not-a-number");
    await GET(request);

    expect(calledUrls.some((url) => url.includes("limit=12"))).toBe(true);
  });

  it("forwards a valid sort param to the underlying request", async () => {
    const calledUrls: string[] = [];
    global.fetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
      calledUrls.push(input.toString());
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [], total: 0, skip: 0, limit: 12 }),
      });
    }) as unknown as typeof fetch;

    const request = new NextRequest("http://localhost/api/v2/search?sort=discount-desc");
    await GET(request);

    expect(calledUrls.some((url) => url.includes("sortBy=discountPercentage") && url.includes("order=desc"))).toBe(
      true,
    );
  });

  it("ignores an unrecognized sort param", async () => {
    const calledUrls: string[] = [];
    global.fetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
      calledUrls.push(input.toString());
      return Promise.resolve({
        ok: true,
        json: async () => ({ products: [], total: 0, skip: 0, limit: 12 }),
      });
    }) as unknown as typeof fetch;

    const request = new NextRequest("http://localhost/api/v2/search?sort=made-up");
    await GET(request);

    expect(calledUrls.every((url) => !url.includes("sortBy"))).toBe(true);
  });

  it("returns a generic 500 error without leaking the underlying failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 503 }) as unknown as typeof fetch;

    const request = new NextRequest("http://localhost/api/v2/search?s=phone");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("No pudimos completar la búsqueda.");
  });
});
