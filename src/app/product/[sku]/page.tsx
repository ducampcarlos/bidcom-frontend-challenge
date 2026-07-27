import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Price } from "@/components/ui/Price";
import { getProductBySkuUseCase } from "@/lib/container";

interface ProductPageProps {
  params: Promise<{ sku: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { sku } = await params;
  const product = await getProductBySkuUseCase.execute(sku);

  if (!product) {
    notFound();
  }

  return (
    <Container className="flex flex-1 flex-col gap-8 py-8 md:flex-row">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white md:w-1/2">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-contain p-8"
          priority
        />
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <p className="text-sm uppercase tracking-wide text-black/50">{product.category}</p>
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <Price value={product.price} className="text-2xl" />
        <p className="text-black/70">{product.description}</p>
      </div>
    </Container>
  );
}
