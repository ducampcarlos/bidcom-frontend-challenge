import type { Product } from "@/core/entities/Product";
import type { ProductRepository } from "@/core/repositories/ProductRepository";

export class GetProductBySkuUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(sku: string): Promise<Product | null> {
    return this.repository.findBySku(sku);
  }
}
