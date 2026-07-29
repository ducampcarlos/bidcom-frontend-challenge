import type { Category } from "@/core/entities/Category";
import type { Product } from "@/core/entities/Product";
import type { ProductSort } from "@/core/repositories/ProductRepository";
import type { ListCategoriesUseCase } from "@/core/use-cases/ListCategories";
import type { SearchProductsUseCase } from "@/core/use-cases/SearchProducts";

export interface ProductListingResult {
  products: Product[];
  categories: Category[];
  total: number;
}

export interface GetProductListingOptions {
  limit?: number;
  skip?: number;
  sort?: ProductSort;
}

// Shared by the Home ("/") and Search ("/search") pages: Home is a search with
// an empty term. Category suggestions are only fetched when the search comes
// back empty, since that's the only time the empty-state UI needs them.
export class GetProductListingUseCase {
  constructor(
    private readonly searchProducts: SearchProductsUseCase,
    private readonly listCategories: ListCategoriesUseCase,
  ) {}

  async execute(query: string, options: GetProductListingOptions = {}): Promise<ProductListingResult> {
    const { limit = 20, skip = 0, sort } = options;
    const { products, total } = await this.searchProducts.execute(query, limit, skip, sort);
    const categories = products.length === 0 ? await this.listCategories.execute(5) : [];
    return { products, categories, total };
  }
}
