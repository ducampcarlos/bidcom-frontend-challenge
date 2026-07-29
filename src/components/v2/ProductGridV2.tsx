import type { Product } from "@/core/entities/Product";
import { ProductCardV2 } from "@/components/v2/ProductCardV2";

export interface ProductGridV2Props {
  products: Product[];
}

export function ProductGridV2({ products }: ProductGridV2Props) {
  return (
    // Flex + justify-center rather than CSS grid: a grid leaves a hard empty
    // track when the last row doesn't fill every column (e.g. 5 items in a
    // 3-column grid), which reads as a layout glitch. Flex-wrap lets an
    // incomplete last row simply center under the ones above it instead.
    <ul className="flex w-full flex-wrap justify-center gap-8">
      {products.map((product) => (
        <li key={product.id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]">
          <ProductCardV2 product={product} />
        </li>
      ))}
    </ul>
  );
}
