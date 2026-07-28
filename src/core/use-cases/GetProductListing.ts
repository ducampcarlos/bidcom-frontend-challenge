import type { Category } from "@/core/entities/Category";
import type { Product } from "@/core/entities/Product";
import type { ListCategoriesUseCase } from "@/core/use-cases/ListCategories";
import type { SearchProductsUseCase } from "@/core/use-cases/SearchProducts";

export interface ProductListingResult {
  products: Product[];
  categories: Category[];
}

// Shared by the Home ("/") and Search ("/search") pages: Home is a search with
// an empty term. Category suggestions are only fetched when the search comes
// back empty, since that's the only time the empty-state UI needs them.
export class GetProductListingUseCase {
  constructor(
    private readonly searchProducts: SearchProductsUseCase,
    private readonly listCategories: ListCategoriesUseCase,
  ) {}

  async execute(query: string): Promise<ProductListingResult> {
    const { products } = await this.searchProducts.execute(query, 20);
    const categories = products.length === 0 ? await this.listCategories.execute(5) : [];
    return { products, categories };
  }
}
