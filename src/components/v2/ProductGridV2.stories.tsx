import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Product } from "@/core/entities/Product";
import { ProductGridV2 } from "./ProductGridV2";

const products: Product[] = [
  {
    id: 1,
    sku: "BEA-ESS-ESS-001",
    title: "Essence Mascara Lash Princess",
    price: 9.99,
    category: "beauty",
    thumbnail: "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
    description: "",
    brand: "Essence",
    rating: 2.56,
    discountPercentage: 10.32,
  },
  {
    id: 2,
    sku: "BEA-GLA-EYE-002",
    title: "Eyeshadow Palette with Mirror",
    price: 19.99,
    category: "beauty",
    thumbnail: "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp",
    description: "",
    brand: "Glamour Beauty",
    rating: 2.86,
  },
  {
    id: 3,
    sku: "BEA-VEL-POW-003",
    title: "Powder Canister",
    price: 14.99,
    category: "beauty",
    thumbnail: "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp",
    description: "",
    brand: "Velvet Touch",
    rating: 4.64,
    discountPercentage: 10.14,
  },
  {
    id: 4,
    sku: "BEA-CHI-LIP-004",
    title: "Red Lipstick",
    price: 12.99,
    category: "beauty",
    thumbnail: "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp",
    description: "",
    brand: "Chic Cosmetics",
    rating: 4.44,
  },
  {
    id: 5,
    sku: "BEA-NAI-NAI-005",
    title: "Red Nail Polish",
    price: 8.99,
    category: "beauty",
    thumbnail: "https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp",
    description: "",
    brand: "Nail Couture",
    rating: 4.32,
  },
];

const meta = {
  title: "V2/ProductGridV2",
  component: ProductGridV2,
  args: {
    products,
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ProductGridV2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// A row that doesn't divide evenly by the column count centers instead of
// hugging the left edge with an empty gap beside it (see ProductGridV2.tsx).
export const IncompleteLastRow: Story = {
  args: {
    products: products.slice(0, 4),
  },
};
