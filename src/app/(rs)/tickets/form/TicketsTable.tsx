"use client";

// api call
import type { TicketSearchResultsType } from "@/lib/queries/getTicketSearchResults";
import { useRouter, useSearchParams } from "next/navigation";
// page polling component
import { usePolling } from "@/hooks/usePolling";
import { useState, useMemo } from "react";
// table components
import FilteredInput from "@/components/react-table/FilteredInput";
import {
  CircleCheck,
  CircleX,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  SortingState,
  useReactTable,
  ColumnFiltersState,
  getFacetedUniqueValues,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { useEffect } from "react";

type TicketData = {
  id: number;
  ticketDate: Date;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  address1: string | null;
  city: string | null;
  state: string | null;
  customerId: number | null;
  ticketTitle: string;
  ticketDescription: string | null;
  ticketStatus: boolean;
  ticketTech: string;
  completed: boolean;
  zip: string | null;
};

type Props = {
  data: TicketData[];
};

type RowType = TicketSearchResultsType[0];

/**
 * TicketsTable - A dynamic table component for displaying and managing ticket data
 * Features:
 * - Sortable columns
 * - Filterable fields
 * - Pagination
 * - Color-coded rows based on ticket status:
 *   - Green: Completed tickets
 *   - Red: New/unassigned tickets (tech email is new-ticket@example.com)
 *   - Yellow: In-progress tickets
 * - Clickable rows that navigate to individual ticket forms
 */
export default function TicketsTable({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for column filtering and sorting
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "ticketDate", desc: false }, // Sort the tickets by oldest first as they have highest priority
  ]);

  // Every 30 seconds, poll the search text
  usePolling(searchParams.get("searchText"), 30000);

  const pageIndex = useMemo(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page) - 1 : 0;
  }, [searchParams.get("page")]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Defines the order and which columns to display in the table */
  const columnHeadersArray: Array<keyof RowType> = [
    "id",
    "ticketTitle",
    "ticketDate",
    "firstName",
    "lastName",
    "ticketTech",
    "completed",
  ];

  //   Used to assign fixed widths to columns
  const columnWidths = {
    ticketTitle: 200,
    completed: 20,
    ticketDate: 100,
    firstName: 100,
    lastName: 100,
    ticketTech: 100,
    id: 20,
  };

  /** Creates a helper for defining column configurations */
  const columnHelper = createColumnHelper<RowType>();

  /** Defines the columns for the table */
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
        size: columnWidths[colName as keyof typeof columnWidths],
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="pl-1 w-full flex justify-between"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {colName[0].toUpperCase() + colName.slice(1)}
              {column.getIsSorted() === "asc" ? <ArrowUp /> : null}
              {column.getIsSorted() === "desc" ? <ArrowDown /> : null}
              {column.getIsSorted() !== "asc" &&
              column.getIsSorted() !== "desc" ? (
                <ArrowUpDown />
              ) : null}
            </Button>
          );
        },
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

  /**
   * Table configuration using TanStack Table
   * - Implements pagination with 10 items per page
   * - Enables column filtering
   * - Enables sorting
   * - Maintains unique values for faceted filtering
   */

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, sorting, pagination: { pageIndex, pageSize: 10 } },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
  });

  const tablePages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  // If the user filters the table and reduces the amount of results, step back pagination to the first page so results are visible
  useEffect(() => {
    if (tablePages <= currentPage && currentPage !== 0) {
      table.setPageIndex(0);
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [table.getState().columnFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="mt-6 rounded-lg overflow-hidden border border-border min-h-[450px]">
        <Table className="border-none">
          {/* Table structure follows these steps:
           * 1. Render header group (column titles and filter inputs)
           * 2. Render body rows with color coding based on status
           * 3. Each row is clickable and navigates to its ticket form
           */}
          <TableHeader className="">
            {/* Step 1: Get all header groups (usually just one group for basic tables) */}
            {table.getHeaderGroups().map((headerGroup) => {
              // Step 2: Create a row for each header group
              return (
                <TableRow key={headerGroup.id}>
                  {/* Step 3: Map through each header cell in this group */}
                  {headerGroup.headers.map((header) => {
                    console.log(header);
                    // Step 4: Create a header cell for each column
                    return (
                      <TableHead
                        key={header.id}
                        className="bg-secondary"
                        style={{ width: `${header.getSize()}px` }}
                      >
                        <div className="mt-2 ml-1 font-bold">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div className="grid place-content-center border rounded-lg overflow-hidden my-2 border-grey-300 dark:border-white bg-inherit">
                            <FilteredInput
                              column={header.column}
                              filteredRows={table
                                .getFilteredRowModel()
                                .rows.map((row) =>
                                  row.getValue(header.column.id)
                                )}
                            />
                          </div>
                        ) : null}
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
            {/* Paginated page navigation arrow left */}
            <div className="flex flex-row justify-around w-full py-4">
              <div
                onClick={() => {
                  if (currentPage === 0) return;
                  const newIndex = table.getState().pagination.pageIndex - 1;
                  table.setPageIndex(newIndex);
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", (newIndex + 1).toString());
                  router.replace(`?${params.toString()}`, { scroll: false });
                }}
                className="bg-transparent border-none text-black dark:text-white hover:cursor-pointer dark:hover:bg-gray-500 hover:bg-gray-200 p-2 rounded-md transition-all duration-400 ease-in-out"
              >
                <ArrowLeft />
              </div>
              {/* Paginated page navigation */}
              <div className="flex flex-row gap-2">
                {Array.from({ length: tablePages }, (_, index) => {
                  return (
                    <div
                      key={index}
                      className={`p-2 rounded-md transition-all duration-400 ease-in-out ${
                        index === currentPage
                          ? "bg-gray-100 dark:bg-gray-600 cursor-default"
                          : "hover:cursor-pointer dark:hover:bg-gray-500 hover:bg-gray-200"
                      }`}
                      onClick={() => {
                        if (index === currentPage) {
                          return;
                        }

                        table.setPageIndex(index);
                        const params = new URLSearchParams(
                          searchParams.toString()
                        );
                        params.set("page", (index + 1).toString());
                        router.replace(`?${params.toString()}`, {
                          scroll: false,
                        });
                      }}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </div>
              {/* Paginated page navigation arrow right */}
              <div
                onClick={() => {
                  console.log(currentPage, table.getPageCount() - 1);
                  if (currentPage === table.getPageCount() - 1) return;
                  const newIndex = table.getState().pagination.pageIndex + 1;
                  table.setPageIndex(newIndex);
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", (newIndex + 1).toString());
                  router.replace(`?${params.toString()}`, { scroll: false });
                }}
                className="bg-transparent border-none text-black dark:text-white hover:cursor-pointer dark:hover:bg-gray-500 hover:bg-gray-200 p-2 rounded-md transition-all duration-400 ease-in-out"
              >
                <ArrowRight />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row justify-center items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.resetSorting();
            table.resetColumnFilters();
            table.resetPagination();
            const params = new URLSearchParams(searchParams.toString());
            params.delete("page");
          }}
        >
          Reset sorting
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.refresh();
          }}
        >
          Refresh results
        </Button>
      </div>
    </>
  );
}
