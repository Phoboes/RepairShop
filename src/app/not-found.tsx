import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "Page not found",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold">Page not found.</h2>
      <p className="py-4">Couldn&apos;t find the requested page.</p>
      <Link href="/" className="text-blue-500 hover:text-blue-600">
        Return home
      </Link>
    </div>
  );
}
