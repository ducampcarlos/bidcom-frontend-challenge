import type { Product } from "@/core/entities/Product";

export interface DummyJsonProductDto {
  id: number;
  sku: string;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
  description?: string;
}

export function mapDtoToProduct(dto: DummyJsonProductDto): Product {
  return {
    id: dto.id,
    sku: dto.sku,
    title: dto.title,
    price: dto.price,
    category: dto.category,
    thumbnail: dto.thumbnail,
    description: dto.description ?? "",
  };
}
