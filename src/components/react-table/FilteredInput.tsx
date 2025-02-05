import { Column } from "@tanstack/react-table";
import DebouncedInput from "./DebouncedInput";

type Props<T> = {
  column: Column<T, unknown>;
};

export default function FilteredInput<T>({ column }: Props<T>) {
  const columnFilterValue = column.getFilterValue();
  return (
    <div>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search (${column.getFacetedUniqueValues().size} items)`}
      />
    </div>
  );
}
