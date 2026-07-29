import Link from "next/link";
import type { Product } from "@/core/entities/Product";
import { Container } from "@/components/ui/Container";
import { OfertasCarousel } from "@/components/v2/OfertasCarousel";

export interface OfertasSectionProps {
  products: Product[];
}

export function OfertasSection({ products }: OfertasSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-black via-brand-dark to-brand">
      <Container className="flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex shrink-0 flex-col items-start gap-6 lg:w-60">
          <div className="rounded-2xl border-2 border-white/30 px-7 py-6">
            <h2 className="text-xl leading-tight font-black tracking-wide text-white uppercase">
              Ofertas destacadas
            </h2>
          </div>
          <Link
            href="/v2/ofertas"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-white/90"
          >
            Ver productos
          </Link>
        </div>
        <div className="min-w-0 flex-1">
          <OfertasCarousel products={products} />
        </div>
      </Container>
    </section>
  );
}
