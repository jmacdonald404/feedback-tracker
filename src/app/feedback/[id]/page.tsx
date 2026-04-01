import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchFeedbackById } from "@/lib/actions/queries";
import { StatusBadge } from "@/components/status-badge";
import { CategoryBadge } from "@/components/category-badge";
import { ThumbsUp, MessageSquare, ArrowLeft } from "lucide-react";

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FeedbackDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await fetchFeedbackById(id);

  if (!post || !post.isPublished) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/feedback"
        className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to board
      </Link>

      <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
        {/* Header */}
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex flex-col items-center gap-1 rounded-lg border border-neutral-200 px-3 py-2 dark:border-neutral-800">
            <ThumbsUp className="h-5 w-5 text-neutral-400" />
            <span className="text-lg font-bold">{post.voteCount}</span>
            <span className="text-xs text-neutral-500">votes</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <CategoryBadge category={post.category} />
              <StatusBadge status={post.status} />
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-800"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="mt-2 text-sm text-neutral-500">
              {post.author ? (
                <span>
                  Posted by {post.author.name} &middot;{" "}
                </span>
              ) : (
                <span>Anonymous &middot; </span>
              )}
              {timeAgo(post.createdAt)}
              {post.assignee && (
                <span> &middot; Assigned to {post.assignee.name}</span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
          {post.description}
        </div>

        {/* Merged notice */}
        {post.mergedIntoId && (
          <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-200">
            This post has been merged into another post.
          </div>
        )}
      </div>

      {/* Comments section (read-only for now, interactive in Phase 4) */}
      <div className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <MessageSquare className="h-5 w-5" />
          Comments ({post.comments.length})
        </h2>

        {post.comments.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">
            No comments yet. Sign in to be the first to comment.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {post.comments.map((comment) => (
              <div
                key={comment.id}
                className={`rounded-lg border p-4 ${
                  comment.isStaffReply
                    ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
                    : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
                }`}
              >
                <div className="flex items-center gap-2 text-sm">
                  {comment.author.image && (
                    <img
                      src={comment.author.image}
                      alt=""
                      className="h-6 w-6 rounded-full"
                    />
                  )}
                  <span className="font-medium">{comment.author.name}</span>
                  {comment.isStaffReply && (
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      Staff
                    </span>
                  )}
                  <span className="text-neutral-500">
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
