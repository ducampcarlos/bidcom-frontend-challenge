import { describe, expect, it } from "vitest";
import { mapDtoToProduct } from "@/infrastructure/dummyjson/mappers";

describe("mapDtoToProduct", () => {
  it("maps a DummyJSON DTO to a domain Product", () => {
    const product = mapDtoToProduct({
      id: 1,
      sku: "BEA-ESS-ESS-001",
      title: "Essence Mascara",
      price: 9.99,
      category: "beauty",
      thumbnail: "https://cdn.dummyjson.com/thumb.webp",
      description: "Mascara",
    });

    expect(product).toEqual({
      id: 1,
      sku: "BEA-ESS-ESS-001",
      title: "Essence Mascara",
      price: 9.99,
      category: "beauty",
      thumbnail: "https://cdn.dummyjson.com/thumb.webp",
      description: "Mascara",
    });
  });

  it("falls back to empty defaults when optional fields are missing", () => {
    const product = mapDtoToProduct({
      id: 2,
      sku: "SKU-2",
      title: "No extras",
      price: 5,
      category: "misc",
      thumbnail: "https://cdn.dummyjson.com/thumb2.webp",
    });

    expect(product.description).toBe("");
  });
});
