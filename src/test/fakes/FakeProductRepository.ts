import type { Category } from "@/core/entities/Category";
import type { Product } from "@/core/entities/Product";
import type { ProductRepository, ProductSearchResult, ProductSort } from "@/core/repositories/ProductRepository";

export class FakeProductRepository implements ProductRepository {
  constructor(
    private readonly products: Product[] = [],
    private readonly categories: Category[] = [],
  ) {}

  async search(query: string, limit = 20, skip = 0, sort?: ProductSort): Promise<ProductSearchResult> {
    const normalized = query.trim().toLowerCase();
    const matches = normalized
      ? this.products.filter((product) => product.title.toLowerCase().includes(normalized))
      : this.products;
    const sorted =
      sort === "discount-desc"
        ? [...matches].sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0))
        : matches;
    return { products: sorted.slice(skip, skip + limit), total: sorted.length };
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.products.find((product) => product.sku === sku) ?? null;
  }

  async listCategories(limit = 5): Promise<Category[]> {
    return this.categories.slice(0, limit);
  }
}
