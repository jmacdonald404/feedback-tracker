import { getAllFeedback } from "@/lib/actions/admin";
import { StatusBadge } from "@/components/status-badge";
import { CategoryBadge } from "@/components/category-badge";
import { AdminFeedbackFilters } from "@/components/admin/feedback-filters";
import { AdminPagination } from "@/components/admin/pagination";
import Link from "next/link";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    category?: string;
    published?: string;
  }>;
}

async function FeedbackTable({
  searchParams,
}: {
  searchParams: Awaited<PageProps["searchParams"]>;
}) {
  const result = await getAllFeedback({
    page: parseInt(searchParams.page ?? "1", 10) || 1,
    status: searchParams.status,
    category: searchParams.category,
    published: searchParams.published,
  });

  if (result.posts.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-neutral-500">
        No feedback found.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left dark:border-neutral-800">
              <th className="pb-2 pr-4 font-medium">Title</th>
              <th className="pb-2 pr-4 font-medium">Category</th>
              <th className="pb-2 pr-4 font-medium">Status</th>
              <th className="pb-2 pr-4 font-medium">Published</th>
              <th className="pb-2 pr-4 font-medium">Votes</th>
              <th className="pb-2 pr-4 font-medium">Assignee</th>
              <th className="pb-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {result.posts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-neutral-100 dark:border-neutral-900"
              >
                <td className="py-3 pr-4">
                  <Link
                    href={`/admin/feedback/${post.id}`}
                    className="font-medium hover:underline"
                  >
                    {post.title}
                  </Link>
                  {post.author?.name && (
                    <p className="text-xs text-neutral-500">
                      by {post.author.name}
                    </p>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <CategoryBadge category={post.category} />
                </td>
                <td className="py-3 pr-4">
                  <StatusBadge status={post.status} />
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      post.isPublished
                        ? "bg-green-500"
                        : "bg-neutral-300 dark:bg-neutral-700"
                    }`}
                  />
                  <span className="ml-1.5">
                    {post.isPublished ? "Yes" : "No"}
                  </span>
                </td>
                <td className="py-3 pr-4">{post.voteCount}</td>
                <td className="py-3 pr-4 text-neutral-500">
                  {post.assignee?.name ?? "—"}
                </td>
                <td className="py-3 text-neutral-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminPagination
        page={result.page}
        totalPages={result.totalPages}
        basePath="/admin/feedback"
      />
    </>
  );
}

export default async function AdminFeedbackPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold">All Feedback</h1>
      <div className="mt-4">
        <Suspense>
          <AdminFeedbackFilters />
        </Suspense>
      </div>
      <div className="mt-4">
        <Suspense
          fallback={
            <div className="py-12 text-center text-sm text-neutral-500">
              Loading...
            </div>
          }
        >
          <FeedbackTable searchParams={resolved} />
        </Suspense>
      </div>
    </div>
  );
}
