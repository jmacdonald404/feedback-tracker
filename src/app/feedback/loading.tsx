export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-9 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="mb-6 flex gap-3">
        <div className="h-10 w-36 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-10 w-36 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-10 w-36 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950"
          >
            <div className="flex gap-4">
              <div className="h-10 w-8 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-full rounded bg-neutral-100 dark:bg-neutral-900" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-5 w-20 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
