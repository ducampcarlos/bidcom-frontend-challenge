import type { Category } from "@/core/entities/Category";
import type { ProductRepository } from "@/core/repositories/ProductRepository";

export class ListCategoriesUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(limit = 5): Promise<Category[]> {
    return this.repository.listCategories(limit);
  }
}
