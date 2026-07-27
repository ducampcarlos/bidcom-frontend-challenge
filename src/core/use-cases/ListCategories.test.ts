import { describe, expect, it } from "vitest";
import { ListCategoriesUseCase } from "@/core/use-cases/ListCategories";
import { FakeProductRepository } from "@/test/fakes/FakeProductRepository";

describe("ListCategoriesUseCase", () => {
  it("returns at most `limit` categories", async () => {
    const repository = new FakeProductRepository([], ["a", "b", "c", "d", "e", "f"]);
    const useCase = new ListCategoriesUseCase(repository);

    const categories = await useCase.execute(5);

    expect(categories).toEqual(["a", "b", "c", "d", "e"]);
  });
});
