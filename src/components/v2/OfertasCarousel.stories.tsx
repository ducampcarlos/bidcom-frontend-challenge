import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Product } from "@/core/entities/Product";
import { OfertasCarousel } from "./OfertasCarousel";

const products: Product[] = [
  {
    id: 1,
    sku: "SPO-BRD-TEN-152",
    title: "Tennis Racket",
    price: 49.99,
    category: "sports-accessories",
    thumbnail: "https://cdn.dummyjson.com/product-images/sports-accessories/tennis-racket/thumbnail.webp",
    description: "",
    rating: 4.0,
    discountPercentage: 19.61,
  },
  {
    id: 2,
    sku: "SMA-APP-IPH-124",
    title: "iPhone X",
    price: 899.99,
    category: "smartphones",
    thumbnail: "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/thumbnail.webp",
    description: "",
    brand: "Apple",
    rating: 2.5,
    discountPercentage: 19.59,
  },
  {
    id: 3,
    sku: "SMA-SAM-SAM-131",
    title: "Samsung Galaxy S7",
    price: 299.99,
    category: "smartphones",
    thumbnail: "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/thumbnail.webp",
    description: "",
    brand: "Samsung",
    rating: 3.3,
    discountPercentage: 19.55,
  },
  {
    id: 4,
    sku: "SPO-BRD-MET-150",
    title: "Metal Baseball Bat",
    price: 29.99,
    category: "sports-accessories",
    thumbnail: "https://cdn.dummyjson.com/product-images/sports-accessories/metal-baseball-bat/thumbnail.webp",
    description: "",
    rating: 4.7,
    discountPercentage: 19.51,
  },
];

const meta = {
  title: "V2/OfertasCarousel",
  component: OfertasCarousel,
  args: {
    products,
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof OfertasCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
