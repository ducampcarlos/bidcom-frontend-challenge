import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeaderV2 } from "./HeaderV2";

const meta = {
  title: "V2/HeaderV2",
  component: HeaderV2,
} satisfies Meta<typeof HeaderV2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
