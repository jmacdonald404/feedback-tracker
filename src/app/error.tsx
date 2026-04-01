"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20">
      <p className="text-6xl font-bold text-neutral-200 dark:text-neutral-800">!</p>
      <h1 className="mt-4 text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-neutral-500">
        An unexpected error occurred. Please try again.
      </p>
      {error.digest && (
        <p className="mt-1 text-xs text-neutral-400">Error ID: {error.digest}</p>
      )}
      <Button className="mt-6" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
