import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
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
    <Container className="flex flex-1 flex-col gap-8 py-8 md:flex-row md:gap-12">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-line bg-white md:w-1/2">
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
        <Badge className="w-fit capitalize">{product.category}</Badge>
        <h1 className="text-3xl font-bold text-balance">{product.title}</h1>
        <Price value={product.price} className="text-3xl" />
        <p className="border-t border-line pt-4 leading-relaxed text-black/70">
          {product.description}
        </p>
      </div>
    </Container>
  );
}
