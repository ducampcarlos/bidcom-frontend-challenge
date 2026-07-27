import { describe, expect, it } from "vitest";
import { GetProductBySkuUseCase } from "@/core/use-cases/GetProductBySku";
import { FakeProductRepository } from "@/test/fakes/FakeProductRepository";
import { mockProduct } from "@/test/fixtures";

describe("GetProductBySkuUseCase", () => {
  it("returns the product matching the sku", async () => {
    const repository = new FakeProductRepository([mockProduct]);
    const useCase = new GetProductBySkuUseCase(repository);

    await expect(useCase.execute(mockProduct.sku)).resolves.toEqual(mockProduct);
  });

  it("returns null when no product matches", async () => {
    const repository = new FakeProductRepository([mockProduct]);
    const useCase = new GetProductBySkuUseCase(repository);

    await expect(useCase.execute("unknown-sku")).resolves.toBeNull();
  });
});
