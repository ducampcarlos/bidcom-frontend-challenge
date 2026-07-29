import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Product } from "@/core/entities/Product";
import { ProductCardV2 } from "./ProductCardV2";

const sampleProduct: Product = {
  id: 1,
  sku: "BEA-ESS-ESS-001",
  title: "Essence Mascara Lash Princess",
  price: 9.99,
  category: "beauty",
  thumbnail: "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
  description: "Volumizing and lengthening effects, cruelty-free formula.",
  brand: "Essence",
  rating: 2.56,
};

const meta = {
  title: "V2/ProductCardV2",
  component: ProductCardV2,
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
} satisfies Meta<typeof ProductCardV2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Discounted: Story = {
  args: {
    product: { ...sampleProduct, discountPercentage: 18.3 },
  },
};

export const NoBrandOrRating: Story = {
  args: {
    product: { ...sampleProduct, brand: undefined, rating: undefined },
  },
};

export const LongTitle: Story = {
  args: {
    product: {
      ...sampleProduct,
      title: "A very long product title that should wrap across two lines and then truncate",
    },
  },
};
