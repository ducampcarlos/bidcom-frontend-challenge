import type { Category } from "@/core/entities/Category";
import type { Product } from "@/core/entities/Product";
import type { ProductRepository, ProductSearchResult } from "@/core/repositories/ProductRepository";

export class FakeProductRepository implements ProductRepository {
  constructor(
    private readonly products: Product[] = [],
    private readonly categories: Category[] = [],
  ) {}

  async search(query: string): Promise<ProductSearchResult> {
    const normalized = query.trim().toLowerCase();
    const matches = normalized
      ? this.products.filter((product) => product.title.toLowerCase().includes(normalized))
      : this.products;
    return { products: matches, total: matches.length };
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.products.find((product) => product.sku === sku) ?? null;
  }

  async listCategories(limit = 5): Promise<Category[]> {
    return this.categories.slice(0, limit);
  }
}
