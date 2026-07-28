import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchBar } from "./SearchBar";

const meta = {
  title: "Layout/SearchBar",
  component: SearchBar,
  decorators: [
    (Story) => (
      <div className="bg-brand p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
