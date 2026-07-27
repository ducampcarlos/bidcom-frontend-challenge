import type { Product } from "@/core/entities/Product";
import type { Category } from "@/core/entities/Category";

export interface ProductSearchResult {
  products: Product[];
  total: number;
}

export interface ProductRepository {
  search(query: string, limit: number): Promise<ProductSearchResult>;
  findBySku(sku: string): Promise<Product | null>;
  listCategories(limit?: number): Promise<Category[]>;
}
