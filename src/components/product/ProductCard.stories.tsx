import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Product } from "@/core/entities/Product";
import { ProductCard } from "./ProductCard";

const sampleProduct: Product = {
  id: 1,
  sku: "BEA-ESS-ESS-001",
  title: "Essence Mascara Lash Princess",
  price: 9.99,
  category: "beauty",
  thumbnail: "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
  description: "Volumizing and lengthening effects, cruelty-free formula.",
};

const meta = {
  title: "Product/ProductCard",
  component: ProductCard,
  args: {
    product: sampleProduct,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongTitle: Story = {
  args: {
    product: {
      ...sampleProduct,
      title: "A very long product title that should wrap across two lines and then truncate",
    },
  },
};
