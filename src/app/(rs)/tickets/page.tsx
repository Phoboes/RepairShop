import { Metadata } from "next";
import SearchForm from "@/components/ui/SearchForm";
import { getTicketSearchResults } from "@/lib/queries/getTicketSearchResults";
import { getOpenTickets } from "@/lib/queries/getOpenTickets";
import TicketsTable from "./form/TicketsTable";

export const metadata: Metadata = {
  title: "Ticket Search",
};

export default async function Tickets({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { searchText } = await searchParams;

  // If no searched params, show default search
  if (!searchText) {
    const results = await getOpenTickets();
    return (
      <>
        <h1 className="text-2xl font-bold">Tickets</h1>
        <SearchForm placeholder="Search tickets" action="/tickets" />
        {results.length > 0 ? (
          <TicketsTable data={results} />
        ) : (
          <p>No open tickets found</p>
        )}
      </>
    );
  }

  const results = await getTicketSearchResults(searchText);

  return (
    <div>
      <h1 className="text-2xl font-bold">Tickets</h1>
      <SearchForm placeholder="Search tickets" action="/tickets" />
      {results.length > 0 ? (
        <TicketsTable data={results} />
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}
