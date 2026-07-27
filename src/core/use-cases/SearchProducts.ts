import type { ProductRepository, ProductSearchResult } from "@/core/repositories/ProductRepository";

export class SearchProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(query: string, limit = 20): Promise<ProductSearchResult> {
    return this.repository.search(query, limit);
  }
}
