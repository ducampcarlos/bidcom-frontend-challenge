import { describe, expect, it } from "vitest";
import { SearchProductsUseCase } from "@/core/use-cases/SearchProducts";
import { FakeProductRepository } from "@/test/fakes/FakeProductRepository";
import { mockProduct } from "@/test/fixtures";

describe("SearchProductsUseCase", () => {
  it("delegates to the repository and returns matching products", async () => {
    const repository = new FakeProductRepository([mockProduct]);
    const useCase = new SearchProductsUseCase(repository);

    const result = await useCase.execute("Test", 20);

    expect(result.products).toEqual([mockProduct]);
    expect(result.total).toBe(1);
  });

  it("returns no products when nothing matches", async () => {
    const repository = new FakeProductRepository([mockProduct]);
    const useCase = new SearchProductsUseCase(repository);

    const result = await useCase.execute("nonexistent", 20);

    expect(result.products).toEqual([]);
  });

  it("passes skip through to the repository for pagination", async () => {
    const products = [mockProduct, { ...mockProduct, id: 2, sku: "TEST-SKU-002" }];
    const repository = new FakeProductRepository(products);
    const useCase = new SearchProductsUseCase(repository);

    const result = await useCase.execute("", 1, 1);

    expect(result.products).toEqual([products[1]]);
    expect(result.total).toBe(2);
  });

  it("passes the sort option through to the repository", async () => {
    const lowDiscount = { ...mockProduct, id: 1, sku: "TEST-SKU-001", discountPercentage: 5 };
    const highDiscount = { ...mockProduct, id: 2, sku: "TEST-SKU-002", discountPercentage: 30 };
    const repository = new FakeProductRepository([lowDiscount, highDiscount]);
    const useCase = new SearchProductsUseCase(repository);

    const result = await useCase.execute("", 20, 0, "discount-desc");

    expect(result.products).toEqual([highDiscount, lowDiscount]);
  });
});
