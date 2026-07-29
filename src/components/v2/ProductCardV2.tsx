import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/core/entities/Product";
import { Price } from "@/components/ui/Price";
import { formatPrice } from "@/lib/formatPrice";

export interface ProductCardV2Props {
  product: Product;
  /** Set for the card(s) rendered above the fold (e.g. the first Ofertas carousel
   * card) so Next.js preloads that image instead of flagging it as a lazy-loaded LCP. */
  priority?: boolean;
}

export function ProductCardV2({ product, priority = false }: ProductCardV2Props) {
  const { discountPercentage } = product;

  return (
    <Link
      href={`/v2/product/${product.sku}`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-200 hover:border-brand/40 hover:shadow-xl"
    >
      <div className="relative aspect-square w-full bg-zinc-50">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
        {discountPercentage != null && discountPercentage > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white">
            -{Math.round(discountPercentage)}%
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {product.brand && (
          <span className="text-xs font-bold tracking-wide text-brand uppercase">{product.brand}</span>
        )}
        <h3 className="line-clamp-2 text-base font-medium text-black">{product.title}</h3>
        {product.rating != null && (
          <span className="flex items-center gap-1 text-xs text-black/60">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-brand" aria-hidden="true">
              <path d="M10 1.5l2.6 5.4 5.9.7-4.3 4.1 1.1 5.9L10 14.8l-5.3 2.8 1.1-5.9L1.5 7.6l5.9-.7L10 1.5z" />
            </svg>
            {product.rating.toFixed(1)}
          </span>
        )}
        <div className="mt-auto flex items-baseline gap-2">
          {discountPercentage != null && discountPercentage > 0 && (
            <span className="text-sm text-black/40 line-through">
              {formatPrice(product.price / (1 - discountPercentage / 100))}
            </span>
          )}
          <Price value={product.price} className="text-xl" />
        </div>
      </div>
    </Link>
  );
}
