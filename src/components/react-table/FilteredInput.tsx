import { Column } from "@tanstack/react-table";
import DebouncedInput from "./DebouncedInput";

type Props<T> = {
  column: Column<T, unknown>;
};

export default function FilteredInput<T>({ column }: Props<T>) {
  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = Array.from(
    column.getFacetedUniqueValues().keys()
  ).sort();
  return (
    <div>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map((value, i) => (
          <option value={String(value)} key={i + column.id} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search (${column.getFacetedUniqueValues().size} items)`}
        list={column.id + "list"}
      />
    </div>
  );
}
