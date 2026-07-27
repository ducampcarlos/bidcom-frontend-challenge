export interface Product {
  id: number;
  sku: string;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
  images: string[];
  description: string;
  brand?: string;
}
