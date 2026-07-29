import { afterEach, describe, expect, it, vi } from "vitest";
import { DummyJsonProductRepository } from "@/infrastructure/dummyjson/DummyJsonProductRepository";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

const categoryProduct = {
  id: 1,
  sku: "BEA-001",
  title: "Category Match",
  price: 9.99,
  category: "beauty",
  thumbnail: "https://cdn.dummyjson.com/thumb.webp",
  description: "",
};

const textMatchProduct = {
  id: 2,
  sku: "MISC-002",
  title: "Text Match",
  price: 4.99,
  category: "misc",
  thumbnail: "https://cdn.dummyjson.com/thumb2.webp",
  description: "",
};

function mockFetch(handler: (url: string) => { products: unknown[]; total: number }) {
  global.fetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
    const url = input.toString();
    const body = handler(url);
    return Promise.resolve({
      ok: true,
      json: async () => ({ ...body, skip: 0, limit: 20 }),
    });
  }) as unknown as typeof fetch;
}

describe("DummyJsonProductRepository.search", () => {
  it("uses the category endpoint when the term matches a real category", async () => {
    mockFetch((url) =>
      url.includes("/products/category/")
        ? { products: [categoryProduct], total: 1 }
        : { products: [], total: 0 },
    );

    const repository = new DummyJsonProductRepository();
    const result = await repository.search("beauty", 20);

    expect(result.products.map((p) => p.title)).toEqual(["Category Match"]);
  });

  it("falls back to the text-search endpoint when the term isn't a category", async () => {
    mockFetch((url) =>
      url.includes("/products/category/")
        ? { products: [], total: 0 }
        : { products: [textMatchProduct], total: 1 },
    );

    const repository = new DummyJsonProductRepository();
    const result = await repository.search("mascara", 20);

    expect(result.products.map((p) => p.title)).toEqual(["Text Match"]);
  });

  it("skips the category endpoint entirely for an empty query", async () => {
    const calledUrls: string[] = [];
    mockFetch((url) => {
      calledUrls.push(url);
      return { products: [textMatchProduct], total: 1 };
    });

    const repository = new DummyJsonProductRepository();
    await repository.search("", 20);

    expect(calledUrls.some((url) => url.includes("/products/category/"))).toBe(false);
  });

  it("forwards skip to the underlying request for pagination", async () => {
    const calledUrls: string[] = [];
    mockFetch((url) => {
      calledUrls.push(url);
      return { products: [textMatchProduct], total: 1 };
    });

    const repository = new DummyJsonProductRepository();
    await repository.search("mascara", 20, 40);

    expect(calledUrls.every((url) => url.includes("skip=40"))).toBe(true);
  });

  it("forwards a discount-desc sort to both the category and text-search requests", async () => {
    const calledUrls: string[] = [];
    mockFetch((url) => {
      calledUrls.push(url);
      return url.includes("/products/category/")
        ? { products: [categoryProduct], total: 1 }
        : { products: [textMatchProduct], total: 1 };
    });

    const repository = new DummyJsonProductRepository();
    await repository.search("beauty", 20, 0, "discount-desc");
    await repository.search("", 20, 0, "discount-desc");

    expect(
      calledUrls.every((url) => url.includes("sortBy=discountPercentage") && url.includes("order=desc")),
    ).toBe(true);
  });

  it("omits the sort params entirely when no sort is requested", async () => {
    const calledUrls: string[] = [];
    mockFetch((url) => {
      calledUrls.push(url);
      return { products: [textMatchProduct], total: 1 };
    });

    const repository = new DummyJsonProductRepository();
    await repository.search("", 20);

    expect(calledUrls.every((url) => !url.includes("sortBy"))).toBe(true);
  });
});

describe("DummyJsonProductRepository.findBySku", () => {
  it("matches sku case-insensitively", async () => {
    mockFetch(() => ({ products: [categoryProduct], total: 1 }));

    const repository = new DummyJsonProductRepository();
    const result = await repository.findBySku("bea-001");

    expect(result?.title).toBe("Category Match");
  });
});

describe("DummyJsonProductRepository error handling", () => {
  it("throws when DummyJSON responds with a non-ok status", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 503 }) as unknown as typeof fetch;

    const repository = new DummyJsonProductRepository();

    await expect(repository.listCategories()).rejects.toThrow(
      "DummyJSON category-list request failed with status 503",
    );
  });
});
