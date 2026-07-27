import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Price } from "./Price";

const meta = {
  title: "UI/Price",
  component: Price,
} satisfies Meta<typeof Price>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 19.99 },
};

export const RoundNumber: Story = {
  args: { value: 100 },
};
