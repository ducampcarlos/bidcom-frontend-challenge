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
    expect(product.brand).toBeUndefined();
    expect(product.rating).toBeUndefined();
    expect(product.discountPercentage).toBeUndefined();
  });

  it("passes through brand, rating and discountPercentage when present", () => {
    const product = mapDtoToProduct({
      id: 3,
      sku: "SKU-3",
      title: "Full DTO",
      price: 20,
      category: "beauty",
      thumbnail: "https://cdn.dummyjson.com/thumb3.webp",
      brand: "Essence",
      rating: 4.5,
      discountPercentage: 12.3,
    });

    expect(product.brand).toBe("Essence");
    expect(product.rating).toBe(4.5);
    expect(product.discountPercentage).toBe(12.3);
  });
});
