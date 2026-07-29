"use client";

import { useMemo, useState } from "react";
import type { Category } from "@/core/entities/Category";
import type { Product } from "@/core/entities/Product";
import type { ProductSort } from "@/core/repositories/ProductRepository";
import { EmptyState } from "@/components/feedback/EmptyState";
import { FilterSortBar } from "@/components/v2/FilterSortBar";
import { ProductGridV2 } from "@/components/v2/ProductGridV2";

export interface ProductListingV2Props {
  query: string;
  initialProducts: Product[];
  initialTotal: number;
  categories: Category[];
  emptyStateCategories: Category[];
  /** A fixed server-side ordering that governs this whole listing (e.g. the "Ofertas"
   * page's best-discount-first order), kept across every fetch (category change,
   * "load more") so pagination never drifts back to the default order. */
  forcedSort?: ProductSort;
}

const PAGE_SIZE = 12;

function ratingOrZero(product: Product): number {
  return product.rating ?? 0;
}

async function fetchListing(
  term: string,
  skip: number,
  sort?: ProductSort,
): Promise<{ products: Product[]; total: number } | null> {
  const params = new URLSearchParams({ s: term, skip: String(skip), limit: String(PAGE_SIZE) });
  if (sort) params.set("sort", sort);
  const response = await fetch(`/api/v2/search?${params.toString()}`);
  if (!response.ok) return null;
  return response.json();
}

// Owns the accumulated (SSR-seeded + "load more"-appended) product list, plus
// sort state. Render this with `key={query}` from the page so a genuinely new
// search resets everything via remount.
//
// Category is NOT a client-side re-slice of whatever happens to already be
// loaded. DummyJSON's catalog groups products by category, so the first
// page (or two) of a generic listing often contains zero items from most
// categories, which made picking one look broken and made "Cargar más" seem
// to do nothing. Instead, choosing a category re-fetches through
// /api/v2/search with the category name as the term (the same repository
// logic that already prioritizes an exact category match, see
// DummyJsonProductRepository.search), so both the initial fetch and every
// subsequent "load more" page real, category-scoped results. Sort stays a
// pure client-side re-order of whatever's currently loaded: it never needs a
// round-trip.
export function ProductListingV2({
  query,
  initialProducts,
  initialTotal,
  categories,
  emptyStateCategories,
  forcedSort,
}: ProductListingV2Props) {
  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const visibleProducts = useMemo(() => {
    if (sort === "price-asc") return [...products].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...products].sort((a, b) => b.price - a.price);
    if (sort === "rating-desc") return [...products].sort((a, b) => ratingOrZero(b) - ratingOrZero(a));
    return products;
  }, [products, sort]);

  const hasMore = products.length < total;

  async function handleCategoryChange(newCategory: string) {
    setCategory(newCategory);

    if (!newCategory) {
      // Back to "Todas": restore the original listing instead of re-fetching it.
      setProducts(initialProducts);
      setTotal(initialTotal);
      return;
    }

    setIsFilterLoading(true);
    try {
      const result = await fetchListing(newCategory, 0, forcedSort);
      setProducts(result?.products ?? []);
      setTotal(result?.total ?? 0);
    } finally {
      setIsFilterLoading(false);
    }
  }

  async function loadMore() {
    setIsLoadingMore(true);
    try {
      const result = await fetchListing(category || query, products.length, forcedSort);
      if (result) {
        setProducts((current) => [...current, ...result.products]);
        setTotal(result.total);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }

  if (initialProducts.length === 0) {
    return <EmptyState categories={emptyStateCategories} searchBasePath="/v2/search" />;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <FilterSortBar
        categories={categories}
        category={category}
        sort={sort}
        onCategoryChange={handleCategoryChange}
        onSortChange={setSort}
        disabled={isFilterLoading}
      />
      {isFilterLoading ? (
        <p className="py-16 text-center text-black/60">Cargando {category}…</p>
      ) : products.length === 0 ? (
        <p className="py-16 text-center text-black/60">Esa categoría no tiene productos por ahora.</p>
      ) : (
        <ProductGridV2 products={visibleProducts} />
      )}
      {!isFilterLoading && hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={isLoadingMore}
          className="mx-auto inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
        >
          {isLoadingMore && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
          {isLoadingMore ? "Cargando…" : "Cargar más"}
        </button>
      )}
    </div>
  );
}
