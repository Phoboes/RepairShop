"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";
// import { Button } from "@/components/ui/button";
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-bold">Something went wrong.</h2>
          <p className="py-4">
            Sorry, we weren&apos;t able to complete that action.
          </p>
        </div>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
