import { Suspense } from "react";
import { fetchPublishedFeedback, type SortOption, type CategoryFilter, type StatusFilter } from "@/lib/actions/queries";
import { FeedbackCard } from "@/components/feedback-card";
import { FeedbackFilters } from "@/components/feedback-filters";
import { Pagination } from "@/components/pagination";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    category?: string;
    status?: string;
  }>;
}

async function FeedbackList({ searchParams }: { searchParams: Awaited<PageProps["searchParams"]> }) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const sort = (searchParams.sort ?? "newest") as SortOption;
  const category = (searchParams.category ?? "ALL") as CategoryFilter;
  const status = (searchParams.status ?? "ALL") as StatusFilter;

  const result = await fetchPublishedFeedback({ page, sort, category, status });

  if (result.posts.length === 0) {
    return (
      <div className="py-16 text-center">
        <MessageSquare className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-700" />
        <h3 className="mt-4 text-lg font-medium">No feedback found</h3>
        <p className="mt-2 text-sm text-neutral-500">
          {category !== "ALL" || status !== "ALL"
            ? "Try adjusting your filters."
            : "Be the first to submit feedback!"}
        </p>
        <Link href="/submit" className="mt-4 inline-block">
          <Button variant="outline" size="sm">Submit Feedback</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-neutral-500 mb-4">
        {result.total} result{result.total !== 1 ? "s" : ""}
      </p>
      <div className="space-y-3">
        {result.posts.map((post) => (
          <FeedbackCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination page={result.page} totalPages={result.totalPages} />
    </>
  );
}

function LoadingSkeleton() {
  return (
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
  );
}

export default async function FeedbackPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Feedback Board</h1>
        <Link href="/submit">
          <Button size="sm">Submit Feedback</Button>
        </Link>
      </div>

      <div className="mb-6">
        <Suspense>
          <FeedbackFilters />
        </Suspense>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <FeedbackList searchParams={resolved} />
      </Suspense>
    </div>
  );
}
