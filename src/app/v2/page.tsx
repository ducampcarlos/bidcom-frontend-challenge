import { Container } from "@/components/ui/Container";
import { OfertasSection } from "@/components/v2/OfertasSection";
import { ProductListingV2 } from "@/components/v2/ProductListingV2";
import { getProductListingUseCase, listCategoriesUseCase, searchProductsUseCase } from "@/lib/container";

const OFERTAS_LIMIT = 6;

export default async function HomeV2Page() {
  const [{ products, categories: emptyStateCategories, total }, allCategories, bestOffers] = await Promise.all([
    getProductListingUseCase.execute(""),
    listCategoriesUseCase.execute(20),
    searchProductsUseCase.execute("", OFERTAS_LIMIT, 0, "discount-desc"),
  ]);

  return (
    <>
      <OfertasSection products={bestOffers.products} />
      <Container className="flex flex-1 flex-col gap-8 py-12">
        <h2 className="text-3xl font-bold tracking-tight text-black">Todos los productos</h2>
        <ProductListingV2
          key=""
          query=""
          initialProducts={products}
          initialTotal={total}
          categories={allCategories}
          emptyStateCategories={emptyStateCategories}
        />
      </Container>
    </>
  );
}
