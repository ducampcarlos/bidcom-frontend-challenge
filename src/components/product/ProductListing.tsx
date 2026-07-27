import type { Category } from "@/core/entities/Category";
import type { Product } from "@/core/entities/Product";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ProductGrid } from "@/components/product/ProductGrid";

export interface ProductListingProps {
  products: Product[];
  emptyStateCategories: Category[];
}

export function ProductListing({ products, emptyStateCategories }: ProductListingProps) {
  if (products.length === 0) {
    return <EmptyState categories={emptyStateCategories} />;
  }

  return <ProductGrid products={products} />;
}
