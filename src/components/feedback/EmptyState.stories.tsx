import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  args: {
    categories: ["beauty", "fragrances", "furniture", "groceries", "home-decoration"],
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
