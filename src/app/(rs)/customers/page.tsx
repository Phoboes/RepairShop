import { Metadata } from "next";
import SearchForm from "@/components/ui/SearchForm";
import { getCustomerSearchResults } from "@/lib/queries/getCustomerSearchResults";
import * as Sentry from "@sentry/nextjs";
import CustomerTable from "./CustomerTable";

export const metadata: Metadata = {
  title: "Customer Search",
};

export default async function Customers({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { searchText } = await searchParams;

  // If no searched params, show the search form
  if (!searchText) {
    return <SearchForm placeholder="Search customers" action="/customers" />;
  }

  const results = await getCustomerSearchResults(searchText);

  return (
    <div>
      <h1 className="text-2xl font-bold">Customers</h1>
      <SearchForm placeholder="Search customers" action="/customers" />
      {results.length > 0 ? (
        <CustomerTable data={results} />
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}
