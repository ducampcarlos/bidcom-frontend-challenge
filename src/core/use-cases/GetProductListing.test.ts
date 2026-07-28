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
});
