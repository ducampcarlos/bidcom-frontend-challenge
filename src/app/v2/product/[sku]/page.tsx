import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Price } from "@/components/ui/Price";
import { formatPrice } from "@/lib/formatPrice";
import { getProductBySkuUseCase } from "@/lib/container";

interface ProductV2PageProps {
  params: Promise<{ sku: string }>;
}

export default async function ProductV2Page({ params }: ProductV2PageProps) {
  const { sku } = await params;
  const product = await getProductBySkuUseCase.execute(sku);

  if (!product) {
    notFound();
  }

  const { discountPercentage } = product;

  return (
    <Container className="flex flex-1 flex-col gap-12 py-12 md:flex-row md:gap-16">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line bg-white md:w-1/2">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-contain p-10"
          priority
        />
        {discountPercentage != null && discountPercentage > 0 && (
          <span className="absolute top-4 left-4 rounded-full bg-brand px-3 py-1 text-sm font-bold text-white">
            -{Math.round(discountPercentage)}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-5">
        <Badge className="w-fit capitalize">{product.category}</Badge>
        {product.brand && (
          <p className="text-sm font-bold tracking-wide text-brand uppercase">{product.brand}</p>
        )}
        <h1 className="text-4xl font-bold text-balance">{product.title}</h1>
        {product.rating != null && (
          <span className="flex items-center gap-1.5 text-sm text-black/60">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-brand" aria-hidden="true">
              <path d="M10 1.5l2.6 5.4 5.9.7-4.3 4.1 1.1 5.9L10 14.8l-5.3 2.8 1.1-5.9L1.5 7.6l5.9-.7L10 1.5z" />
            </svg>
            {product.rating.toFixed(1)} de calificación
          </span>
        )}
        <div className="flex items-baseline gap-3">
          {discountPercentage != null && discountPercentage > 0 && (
            <span className="text-lg text-black/40 line-through">
              {formatPrice(product.price / (1 - discountPercentage / 100))}
            </span>
          )}
          <Price value={product.price} className="text-4xl text-brand" />
        </div>
        <p className="border-t border-line pt-5 leading-relaxed text-black/70">{product.description}</p>
      </div>
    </Container>
  );
}
