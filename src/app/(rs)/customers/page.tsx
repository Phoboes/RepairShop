import { Metadata } from "next";
import SearchForm from "@/components/ui/SearchForm";
import { getCustomerSearchResults } from "@/lib/queries/getCustomerSearchResults";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

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

  const span = Sentry.startInactiveSpan({
    name: "getCustomerSearchResults-1",
  });
  const results = await getCustomerSearchResults(searchText);
  span.end();

  return (
    <div>
      <h1 className="text-2xl font-bold">Customers</h1>
      <SearchForm placeholder="Search customers" action="/customers" />
      {results.length > 0 ? (
        <ul>
          {results.map((result) => (
            <>
              <Link href={`/customers/form?customerId=${result.id}`}>
                <li
                  key={result.id}
                  className={`${
                    result.active ? "bg-green-500" : "bg-red-500"
                  } my-2`}
                >
                  <p>
                    {result.firstName} {result.lastName}
                  </p>
                  <span>
                    <span>Email: {result.email}</span>
                    <span className="ml-2">Phone:{result.phone}</span>
                  </span>
                  <p>{result.address1}</p>
                  <p>{result.address2}</p>
                  <p>
                    {result.city}, {result.state} {result.zip}
                  </p>
                </li>
              </Link>
              <hr />
            </>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}
