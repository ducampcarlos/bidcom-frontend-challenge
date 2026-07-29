"use client";

import { useRef } from "react";
import type { Product } from "@/core/entities/Product";
import { ProductCardV2 } from "@/components/v2/ProductCardV2";

export interface OfertasCarouselProps {
  products: Product[];
}

const SCROLL_AMOUNT = 320;

const ARROW_BUTTON_CLASSES =
  "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand shadow-lg transition-transform hover:scale-110 sm:flex";

export function OfertasCarousel({ products }: OfertasCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);

  function scroll(direction: 1 | -1) {
    trackRef.current?.scrollBy({ left: direction * SCROLL_AMOUNT, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Anterior"
        className={`${ARROW_BUTTON_CLASSES} -left-4`}
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, index) => (
          <li key={product.id} className="w-64 shrink-0 snap-start sm:w-72">
            <ProductCardV2 product={product} priority={index === 0} />
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Siguiente"
        className={`${ARROW_BUTTON_CLASSES} -right-4`}
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
