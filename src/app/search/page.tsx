import { Container } from "@/components/ui/Container";
import { ProductListing } from "@/components/product/ProductListing";
import { getProductListing } from "@/lib/getProductListing";

interface SearchPageProps {
  searchParams: Promise<{ s?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { s } = await searchParams;
  const { products, categories } = await getProductListing(s ?? "");

  return (
    <Container className="flex flex-1 flex-col gap-6 py-8">
      <ProductListing products={products} emptyStateCategories={categories} />
    </Container>
  );
}
