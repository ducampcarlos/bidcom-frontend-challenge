import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { FilterSortBar, type FilterSortBarProps } from "./FilterSortBar";

const categories = ["beauty", "fragrances", "furniture", "groceries", "smartphones"];

// FilterSortBar is a pure controlled component (see its own file for why), so the
// story needs to hold category/sort itself for the selects to actually respond
// to interaction in the Storybook canvas.
function FilterSortBarDemo(props: Omit<FilterSortBarProps, "onCategoryChange" | "onSortChange">) {
  const [category, setCategory] = useState(props.category);
  const [sort, setSort] = useState(props.sort);

  return (
    <FilterSortBar
      {...props}
      category={category}
      sort={sort}
      onCategoryChange={setCategory}
      onSortChange={setSort}
    />
  );
}

const meta = {
  title: "V2/FilterSortBar",
  component: FilterSortBarDemo,
  args: {
    categories,
    category: "",
    sort: "",
  },
} satisfies Meta<typeof FilterSortBarDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    category: "beauty",
    disabled: true,
  },
};
