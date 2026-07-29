import { Container } from "@/components/ui/Container";
import { ProductListingV2 } from "@/components/v2/ProductListingV2";
import { getProductListingUseCase, listCategoriesUseCase } from "@/lib/container";

export default async function OfertasV2Page() {
  const [{ products, categories: emptyStateCategories, total }, allCategories] = await Promise.all([
    getProductListingUseCase.execute("", { sort: "discount-desc" }),
    listCategoriesUseCase.execute(20),
  ]);

  return (
    <Container className="flex flex-1 flex-col gap-8 py-12">
      <div>
        <p className="text-sm font-bold tracking-widest text-brand uppercase">Ofertas</p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight text-black">Las mejores ofertas</h1>
      </div>
      <ProductListingV2
        key="ofertas"
        query=""
        forcedSort="discount-desc"
        initialProducts={products}
        initialTotal={total}
        categories={allCategories}
        emptyStateCategories={emptyStateCategories}
      />
    </Container>
  );
}
