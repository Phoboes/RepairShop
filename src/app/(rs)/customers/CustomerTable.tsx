"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type selectCustomerSchemaType } from "@/zod-schemas/customers";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

type Props = {
  data: selectCustomerSchemaType[];
};

export default function CustomerTable({ data }: Props) {
  const router = useRouter();
  const columnHeadersArray: Array<keyof selectCustomerSchemaType> = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "address1",
    "city",
    "state",
    "zip",
  ];

  const columnHelper = createColumnHelper<selectCustomerSchemaType>();

  const columns = columnHeadersArray.map((colName) =>
    columnHelper.accessor(colName, {
      id: colName,
      header: colName[0].toUpperCase() + colName.slice(1),
    })
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-6 rounded-lg overflow-hidden border border-border">
      <Table className="border-none">
        <TableHeader className="">
          {/* Step 1: Get all header groups (usually just one group for basic tables) */}
          {table.getHeaderGroups().map((headerGroup) => {
            // Step 2: Create a row for each header group
            return (
              <TableRow key={headerGroup.id}>
                {/* Step 3: Map through each header cell in this group */}
                {headerGroup.headers.map((header) => {
                  // Step 4: Create a header cell for each column
                  return (
                    <TableHead key={header.id} className="bg-secondary">
                      <div>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody className="bg-secondary border-none">
          {/* Step 1: Get all rows from the table model and map through them */}
          {table.getRowModel().rows.map((row) => {
            return (
              // Step 2: Create a row for each data entry
              <TableRow
                key={row.id}
                className={`cursor-pointer ${
                  row.original.active
                    ? "bg-green-500 hover:bg-green-500 bg-opacity-10 hover:bg-opacity-25 dark:hover:bg-opacity-25 "
                    : "bg-red-500 hover:bg-red-500 bg-opacity-10 hover:bg-opacity-25 dark:hover:bg-opacity-25 "
                }`}
                // Step 3: Add click handler to navigate to customer form
                onClick={() => {
                  router.push(`/customers/form?customerId=${row.original.id}`);
                }}
              >
                {/* Step 4: Get all visible cells for this row and map through them */}
                {row.getVisibleCells().map((cell) => {
                  return (
                    // Step 5: Create a cell for each piece of data
                    <TableCell key={cell.id} className="border">
                      {/* Step 6: Render the cell content using flexRender */}
                      {flexRender(
                        // The cell content definition
                        cell.column.columnDef.cell,
                        // The context (provides necessary props and state)
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
