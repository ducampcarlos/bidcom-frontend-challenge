import { Container } from "@/components/ui/Container";
import { ProductListing } from "@/components/product/ProductListing";
import { getProductListingUseCase } from "@/lib/container";

interface SearchPageProps {
  searchParams: Promise<{ s?: string | string[] }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { s } = await searchParams;
  const query = Array.isArray(s) ? (s[0] ?? "") : (s ?? "");

  const { products, categories } = await getProductListingUseCase.execute(query);

  return (
    <Container className="flex flex-1 flex-col gap-6 py-8">
      <ProductListing products={products} emptyStateCategories={categories} />
    </Container>
  );
}
