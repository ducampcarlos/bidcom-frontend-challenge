import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/(shop)/page";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("HomePage (integration)", () => {
  it("renders the default product listing", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        products: [
          {
            id: 1,
            sku: "SKU-1",
            title: "Default Product",
            price: 12.5,
            category: "misc",
            thumbnail: "https://cdn.dummyjson.com/product-images/misc/thumbnail.webp",
            description: "",
          },
        ],
        total: 1,
        skip: 0,
        limit: 20,
      }),
    }) as unknown as typeof fetch;

    const jsx = await HomePage();
    render(jsx);

    expect(await screen.findByText("Default Product")).toBeInTheDocument();
  });
});
