import { Column } from "@tanstack/react-table";
import DebouncedInput from "./DebouncedInput";

type Props<T> = {
  column: Column<T, unknown>;
  filteredRows: string[];
};

export default function FilteredInput<T>({ column, filteredRows }: Props<T>) {
  const columnFilterValue = column.getFilterValue();
  const uniqueFilteredValues = new Set(filteredRows);

  const sortedUniqueValues = Array.from(uniqueFilteredValues).sort();
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
        placeholder={`Search (${uniqueFilteredValues.size} items)`}
        list={column.id + "list"}
      />
    </div>
  );
}
