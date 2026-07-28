import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/core/entities/Product";
import { Price } from "@/components/ui/Price";

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.sku}`}
      className="group flex w-full flex-col overflow-hidden rounded-lg border border-line bg-white transition-shadow duration-200 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full bg-zinc-50">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-contain p-4 transition-transform duration-200 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-black">{product.title}</h3>
        <Price value={product.price} className="mt-auto text-lg" />
      </div>
    </Link>
  );
}
