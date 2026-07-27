import type { Product } from "@/core/entities/Product";

export const mockProduct: Product = {
  id: 1,
  sku: "TEST-SKU-001",
  title: "Test Product",
  price: 19.99,
  category: "test-category",
  thumbnail: "https://cdn.dummyjson.com/product-images/test/thumbnail.webp",
  images: ["https://cdn.dummyjson.com/product-images/test/1.webp"],
  description: "A product used for testing.",
  brand: "TestBrand",
};
