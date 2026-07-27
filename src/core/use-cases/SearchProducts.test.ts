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
});
