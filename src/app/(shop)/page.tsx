import { Container } from "@/components/ui/Container";
import { ProductListing } from "@/components/product/ProductListing";
import { getProductListingUseCase } from "@/lib/container";

export default async function HomePage() {
  const { products, categories } = await getProductListingUseCase.execute("");

  return (
    <Container className="flex flex-1 flex-col gap-6 py-8">
      <ProductListing products={products} emptyStateCategories={categories} />
    </Container>
  );
}
