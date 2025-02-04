import { Metadata } from "next";
import SearchForm from "@/components/ui/SearchForm";
import { getTicketSearchResults } from "@/lib/queries/getTicketSearchResults";
import { getOpenTickets } from "@/lib/queries/getOpenTickets";
import Link from "next/link";

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
          <ul>
            {results.map((result) => (
              <Link
                key={result.id}
                href={`/tickets/form?ticketId=${result.id}`}
              >
                <li>
                  <div
                    className={`${
                      result.ticketStatus
                        ? "bg-green-500 bg-opacity-50"
                        : result.ticketTech === "new-ticket@example.com"
                        ? "bg-red-500 bg-opacity-50"
                        : "bg-yellow-500 bg-opacity-50"
                    } my-2 p-2 rounded-md`}
                  >
                    <p className="font-bold text-lg">
                      {result.ticketTitle}, ID: {result.id}
                    </p>
                    <hr />
                    <span className="font-bold">
                      Customer: {result.firstName} {result.lastName}
                    </span>
                    <span className="ml-2 font-bold">
                      Technician:{" "}
                      {result.ticketTech === "new-ticket@example.com"
                        ? "UNASSIGNED"
                        : result.ticketTech}
                    </span>
                    <hr />
                    <p>Description: {result.ticketDescription}</p>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <p>No results found</p>
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
        <ul>
          {results.map((result) => (
            <Link key={result.id} href={`/tickets/form?ticketId=${result.id}`}>
              <li>
                <div
                  className={`${
                    result.ticketStatus
                      ? "bg-green-500 bg-opacity-50"
                      : result.ticketTech === "new-ticket@example.com"
                      ? "bg-red-500 bg-opacity-50"
                      : "bg-yellow-500 bg-opacity-50"
                  } my-2 p-2 rounded-md`}
                >
                  <div className="py-2 border-b border-gray-900 border-opacity-30 pb-2">
                    <p className="font-bold text-lg">
                      {result.ticketTitle}, ID: {result.id}
                    </p>
                  </div>
                  <div className="py-2 border-b border-gray-900 border-opacity-30 pb-2">
                    <span>
                      Customer:{" "}
                      <span className="font-bold">
                        {result.firstName} {result.lastName}
                      </span>
                    </span>
                    <span className="ml-2">
                      Technician:{" "}
                      <span className="font-bold">
                        {result.ticketTech === "new-ticket@example.com"
                          ? "UNASSIGNED"
                          : result.ticketTech}
                      </span>
                    </span>
                  </div>
                  <p className="py-2">
                    Description: {result.ticketDescription}
                  </p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}
