import type { Category } from "@/core/entities/Category";
import type { Product } from "@/core/entities/Product";
import type { ProductRepository, ProductSearchResult } from "@/core/repositories/ProductRepository";
import { API_BASE_URL } from "@/lib/config";
import { mapDtoToProduct, type DummyJsonProductDto } from "./mappers";

interface DummyJsonSearchResponseDto {
  products: DummyJsonProductDto[];
  total: number;
  skip: number;
  limit: number;
}

const PRODUCT_FIELDS = "id,sku,title,price,category,thumbnail,description";

async function fetchJson<T>(url: string, revalidateSeconds: number, errorLabel: string): Promise<T> {
  const response = await fetch(url, { next: { revalidate: revalidateSeconds } });
  if (!response.ok) {
    throw new Error(`DummyJSON ${errorLabel} request failed with status ${response.status}`);
  }
  return response.json();
}

export class DummyJsonProductRepository implements ProductRepository {
  async search(query: string, limit: number): Promise<ProductSearchResult> {
    const url = `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&select=${PRODUCT_FIELDS}`;
    const data = await fetchJson<DummyJsonSearchResponseDto>(url, 60, "search");
    return {
      products: data.products.map(mapDtoToProduct),
      total: data.total,
    };
  }

  async findBySku(sku: string): Promise<Product | null> {
    // DummyJSON has no lookup-by-sku endpoint: sku is a plain field, not a key.
    // The full catalog (~194 items) is fetched with a trimmed field selection and
    // filtered locally; cached longer since it's the same request for every product page.
    const url = `${API_BASE_URL}/products?limit=0&select=${PRODUCT_FIELDS}`;
    const data = await fetchJson<DummyJsonSearchResponseDto>(url, 3600, "products");
    const match = data.products.find((product) => product.sku === sku);
    return match ? mapDtoToProduct(match) : null;
  }

  async listCategories(limit = 5): Promise<Category[]> {
    const url = `${API_BASE_URL}/products/category-list`;
    const categories = await fetchJson<string[]>(url, 3600, "category-list");
    return categories.slice(0, limit);
  }
}
