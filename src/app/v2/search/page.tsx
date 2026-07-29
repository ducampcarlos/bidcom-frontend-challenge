import { Container } from "@/components/ui/Container";
import { ProductListingV2 } from "@/components/v2/ProductListingV2";
import { getProductListingUseCase, listCategoriesUseCase } from "@/lib/container";

interface SearchV2PageProps {
  searchParams: Promise<{ s?: string | string[] }>;
}

export default async function SearchV2Page({ searchParams }: SearchV2PageProps) {
  const { s } = await searchParams;
  const query = Array.isArray(s) ? (s[0] ?? "") : (s ?? "");

  const [{ products, categories: emptyStateCategories, total }, allCategories] = await Promise.all([
    getProductListingUseCase.execute(query),
    listCategoriesUseCase.execute(20),
  ]);

  return (
    <Container className="flex flex-1 flex-col gap-8 py-12">
      <ProductListingV2
        key={query}
        query={query}
        initialProducts={products}
        initialTotal={total}
        categories={allCategories}
        emptyStateCategories={emptyStateCategories}
      />
    </Container>
  );
}
