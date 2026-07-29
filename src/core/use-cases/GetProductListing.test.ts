import { describe, expect, it } from "vitest";
import { GetProductListingUseCase } from "@/core/use-cases/GetProductListing";
import { ListCategoriesUseCase } from "@/core/use-cases/ListCategories";
import { SearchProductsUseCase } from "@/core/use-cases/SearchProducts";
import { FakeProductRepository } from "@/test/fakes/FakeProductRepository";
import { mockProduct } from "@/test/fixtures";

function buildUseCase(repository: FakeProductRepository) {
  return new GetProductListingUseCase(new SearchProductsUseCase(repository), new ListCategoriesUseCase(repository));
}

describe("GetProductListingUseCase", () => {
  it("returns matching products and no categories when there are results", async () => {
    const repository = new FakeProductRepository([mockProduct], ["beauty", "fragrances"]);
    const useCase = buildUseCase(repository);

    const result = await useCase.execute("Test");

    expect(result.products).toEqual([mockProduct]);
    expect(result.categories).toEqual([]);
  });

  it("falls back to category suggestions when nothing matches", async () => {
    const repository = new FakeProductRepository([mockProduct], ["beauty", "fragrances"]);
    const useCase = buildUseCase(repository);

    const result = await useCase.execute("nonexistent");

    expect(result.products).toEqual([]);
    expect(result.categories).toEqual(["beauty", "fragrances"]);
  });

  it("returns the total match count and honors limit/skip for pagination", async () => {
    const products = [mockProduct, { ...mockProduct, id: 2, sku: "TEST-SKU-002" }];
    const repository = new FakeProductRepository(products);
    const useCase = buildUseCase(repository);

    const result = await useCase.execute("", { limit: 1, skip: 1 });

    expect(result.products).toEqual([products[1]]);
    expect(result.total).toBe(2);
  });

  it("honors the sort option, ordering best discount first", async () => {
    const lowDiscount = { ...mockProduct, id: 1, sku: "TEST-SKU-001", discountPercentage: 5 };
    const highDiscount = { ...mockProduct, id: 2, sku: "TEST-SKU-002", discountPercentage: 30 };
    const repository = new FakeProductRepository([lowDiscount, highDiscount]);
    const useCase = buildUseCase(repository);

    const result = await useCase.execute("", { sort: "discount-desc" });

    expect(result.products).toEqual([highDiscount, lowDiscount]);
  });
});
