"use client";

import type { TicketSearchResultsType } from "@/lib/queries/getTicketSearchResults";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FilteredInput from "@/components/react-table/FilteredInput";
import { CircleCheck, CircleX, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";

type Props = {
  data: TicketSearchResultsType;
};

type RowType = TicketSearchResultsType[0];

export default function TicketsTable({ data }: Props) {
  const router = useRouter();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const columnHeadersArray: Array<keyof RowType> = [
    "id",
    "ticketDate",
    "firstName",
    "lastName",
    "ticketTech",
    "completed",
  ];

  const columnHelper = createColumnHelper<RowType>();

  const columns = columnHeadersArray.map((colName) =>
    columnHelper.accessor(
      (row) => {
        const value = row[colName];
        if (colName === "ticketDate" && value instanceof Date) {
          return value.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }

        if (colName === "completed" && typeof value === "boolean") {
          return value ? "COMPLETE" : "OPEN";
        }

        return value;
      },
      {
        id: colName,
        header: colName[0].toUpperCase() + colName.slice(1),
        cell: ({ getValue }) => {
          const value = getValue();
          if (colName === "completed") {
            return (
              <div className="grid place-content-center">
                {value === "OPEN" ? (
                  <CircleX className="opacity-25" />
                ) : (
                  <CircleCheck className="opacity-25" />
                )}
              </div>
            );
          }
          return value;
        },
      }
    )
  );

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters },
    initialState: { pagination: { pageSize: 10 } },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  //   console.log(table);

  const tablePages = table.getPageCount();

  return (
    <>
      <div className="mt-6 rounded-lg overflow-hidden border border-border min-h-[450px]">
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
                  className={`cursor-pointer
                    ${
                      row.original.completed
                        ? "bg-green-500 bg-opacity-50"
                        : row.original.ticketTech === "new-ticket@example.com"
                        ? "bg-red-500 bg-opacity-50"
                        : "bg-yellow-500 bg-opacity-50"
                    }`}
                  // Step 3: Add click handler to navigate to ticket form
                  onClick={() => {
                    router.push(`/tickets/form?ticketId=${row.original.id}`);
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
      {tablePages > 1 && (
        <div className="w-full">
          <div className="">
            <div className="w-full flex-row justify-center text-center">
              <p className="text-sm text-muted-foreground pt-2">{`Page ${
                table.getState().pagination.pageIndex + 1
              } of ${tablePages}  (${table.getFilteredRowModel().rows.length} ${
                table.getFilteredRowModel().rows.length !== 1
                  ? "total results"
                  : "result"
              })`}</p>
            </div>
            <div className="flex flex-row justify-around w-full py-4">
              <div
                onClick={() => table.previousPage()}
                className="bg-transparent border-none text-black dark:text-white hover:cursor-pointer dark:hover:bg-gray-500 hover:bg-gray-200 p-2 rounded-md transition-all duration-400 ease-in-out"
              >
                <ArrowLeft />
              </div>
              <div className="flex flex-row gap-2">
                {Array.from({ length: tablePages }, (_, index) => {
                  const pageState = table.getState();
                  return (
                    <div
                      key={index}
                      className={`p-2 rounded-md transition-all duration-400 ease-in-out ${
                        index === pageState.pagination.pageIndex
                          ? "bg-gray-100 dark:bg-gray-600 cursor-default"
                          : "hover:cursor-pointer dark:hover:bg-gray-500 hover:bg-gray-200"
                      }`}
                      onClick={() => table.setPageIndex(index)}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </div>
              <div
                onClick={() => table.nextPage()}
                className="bg-transparent border-none text-black dark:text-white hover:cursor-pointer dark:hover:bg-gray-500 hover:bg-gray-200 p-2 rounded-md transition-all duration-400 ease-in-out"
              >
                <ArrowRight />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
