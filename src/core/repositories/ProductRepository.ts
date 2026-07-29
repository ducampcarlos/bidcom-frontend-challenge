import type { Product } from "@/core/entities/Product";
import type { Category } from "@/core/entities/Category";

export interface ProductSearchResult {
  products: Product[];
  total: number;
}

/** Server-side ordering for the whole result set (beyond a single loaded page). Currently
 * only used to surface best-discount-first listings (the V2 "Ofertas" section/page). Plain
 * price/rating sort stays a client-side re-order of whatever's already loaded (see
 * ProductListingV2), since that never needs a fresh page from the server. */
export type ProductSort = "discount-desc";

export interface ProductRepository {
  /** An empty query returns the default, unfiltered listing (used by the Home page). */
  search(query: string, limit: number, skip?: number, sort?: ProductSort): Promise<ProductSearchResult>;
  findBySku(sku: string): Promise<Product | null>;
  listCategories(limit?: number): Promise<Category[]>;
}
