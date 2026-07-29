import type { Category } from "@/core/entities/Category";
import type { Product } from "@/core/entities/Product";
import type { ProductRepository, ProductSearchResult, ProductSort } from "@/core/repositories/ProductRepository";
import { API_BASE_URL } from "@/lib/config";
import { mapDtoToProduct, type DummyJsonProductDto } from "./mappers";

interface DummyJsonSearchResponseDto {
  products: DummyJsonProductDto[];
  total: number;
  skip: number;
  limit: number;
}

const PRODUCT_FIELDS = "id,sku,title,price,category,thumbnail,description,brand,rating,discountPercentage";

const SORT_QUERY: Record<ProductSort, string> = {
  "discount-desc": "&sortBy=discountPercentage&order=desc",
};

async function fetchJson<T>(url: string, revalidateSeconds: number, errorLabel: string): Promise<T> {
  const response = await fetch(url, { next: { revalidate: revalidateSeconds } });
  if (!response.ok) {
    throw new Error(`DummyJSON ${errorLabel} request failed with status ${response.status}`);
  }
  return response.json();
}

function toSearchResult(data: DummyJsonSearchResponseDto): ProductSearchResult {
  return {
    products: data.products.map(mapDtoToProduct),
    total: data.total,
  };
}

export class DummyJsonProductRepository implements ProductRepository {
  async search(query: string, limit: number, skip = 0, sort?: ProductSort): Promise<ProductSearchResult> {
    const trimmed = query.trim();
    const sortParam = sort ? SORT_QUERY[sort] : "";

    // The "recommended categories" links (EmptyState) point at /search?s=$categoria per the
    // spec, so a non-empty term might actually be a category slug rather than free text.
    // DummyJSON's full-text search (q=) does NOT match against the category field, so try the
    // category endpoint first; an unknown/non-category term returns an empty list (200, not an
    // error), and we fall back to the regular text search in that case.
    if (trimmed) {
      const categoryUrl = `${API_BASE_URL}/products/category/${encodeURIComponent(trimmed)}?limit=${limit}&skip=${skip}&select=${PRODUCT_FIELDS}${sortParam}`;
      const categoryData = await fetchJson<DummyJsonSearchResponseDto>(categoryUrl, 60, "category");
      if (categoryData.products.length > 0) {
        return toSearchResult(categoryData);
      }
    }

    const url = `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}&select=${PRODUCT_FIELDS}${sortParam}`;
    const data = await fetchJson<DummyJsonSearchResponseDto>(url, 60, "search");
    return toSearchResult(data);
  }

  async findBySku(sku: string): Promise<Product | null> {
    // DummyJSON has no lookup-by-sku endpoint: sku is a plain field, not a key.
    // The full catalog (~194 items) is fetched with a trimmed field selection and
    // filtered locally; cached longer since it's the same request for every product page.
    const url = `${API_BASE_URL}/products?limit=0&select=${PRODUCT_FIELDS}`;
    const data = await fetchJson<DummyJsonSearchResponseDto>(url, 3600, "products");
    const normalized = sku.toLowerCase();
    const match = data.products.find((product) => product.sku.toLowerCase() === normalized);
    return match ? mapDtoToProduct(match) : null;
  }

  async listCategories(limit = 5): Promise<Category[]> {
    const url = `${API_BASE_URL}/products/category-list`;
    const categories = await fetchJson<string[]>(url, 3600, "category-list");
    return categories.slice(0, limit);
  }
}
