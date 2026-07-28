import type { Category } from "@/core/entities/Category";
import type { Product } from "@/core/entities/Product";
import { listCategoriesUseCase, searchProductsUseCase } from "@/lib/container";

export interface ProductListingData {
  products: Product[];
  categories: Category[];
}

// Shared by the Home ("/") and Search ("/search") pages: Home is a search
// with an empty term, which SearchProductsUseCase treats as "no filter".
export async function getProductListing(query: string): Promise<ProductListingData> {
  const { products } = await searchProductsUseCase.execute(query, 20);
  const categories = products.length === 0 ? await listCategoriesUseCase.execute(5) : [];
  return { products, categories };
}
