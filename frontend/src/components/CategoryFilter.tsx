import { Button } from "./ui";
import type { ProductCategory } from "../types/store";

interface CategoryFilterProps {
  selected: "all" | ProductCategory;
  categories: Array<{ value: "all" | ProductCategory; label: string }>;
  onSelect: (value: "all" | ProductCategory) => void;
}

export const CategoryFilter = ({ selected, categories, onSelect }: CategoryFilterProps): JSX.Element => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = selected === category.value;
        return (
          <Button
            key={category.value}
            type="button"
            variant={isActive ? "primary" : "secondary"}
            className={isActive ? "" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}
            onClick={() => onSelect(category.value)}
          >
            {category.label}
          </Button>
        );
      })}
    </div>
  );
};
