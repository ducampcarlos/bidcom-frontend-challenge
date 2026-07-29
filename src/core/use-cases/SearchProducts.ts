import type { ProductRepository, ProductSearchResult, ProductSort } from "@/core/repositories/ProductRepository";

export class SearchProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(query: string, limit = 20, skip = 0, sort?: ProductSort): Promise<ProductSearchResult> {
    return this.repository.search(query, limit, skip, sort);
  }
}
