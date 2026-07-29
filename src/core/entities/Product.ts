export interface Product {
  id: number;
  sku: string;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
  description: string;
  brand?: string;
  rating?: number;
  discountPercentage?: number;
}
