import { Container } from "@/components/ui/Container";
import { ProductListing } from "@/components/product/ProductListing";
import { listCategoriesUseCase, searchProductsUseCase } from "@/lib/container";

interface SearchPageProps {
  searchParams: Promise<{ s?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { s } = await searchParams;
  const query = s ?? "";

  const { products } = await searchProductsUseCase.execute(query, 20);
  const categories = products.length === 0 ? await listCategoriesUseCase.execute(5) : [];

  return (
    <Container className="flex flex-1 flex-col gap-6 py-8">
      <ProductListing products={products} emptyStateCategories={categories} />
    </Container>
  );
}
