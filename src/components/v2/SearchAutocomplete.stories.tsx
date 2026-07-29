import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchAutocomplete } from "./SearchAutocomplete";

const meta = {
  title: "V2/SearchAutocomplete",
  component: SearchAutocomplete,
  decorators: [
    (Story) => (
      <div className="max-w-xl bg-white p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
