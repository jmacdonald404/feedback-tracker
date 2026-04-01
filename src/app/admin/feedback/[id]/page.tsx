import { notFound } from "next/navigation";
import { getAdminFeedbackDetail, getAdminStaff } from "@/lib/actions/admin";
import { StatusBadge } from "@/components/status-badge";
import { CategoryBadge } from "@/components/category-badge";
import { AdminStatusSelect } from "@/components/admin/status-select";
import { AdminAssigneeSelect } from "@/components/admin/assignee-select";
import { AdminPublishToggle } from "@/components/admin/publish-toggle";
import { AdminTagInput } from "@/components/admin/tag-input";
import { AdminMergeDialog } from "@/components/admin/merge-dialog";
import { CommentForm } from "@/components/comment-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default async function AdminFeedbackDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [post, staff] = await Promise.all([
    getAdminFeedbackDetail(id),
    getAdminStaff(),
  ]);

  if (!post) notFound();

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/feedback"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to feedback
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
            <h1 className="text-xl font-bold">{post.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <CategoryBadge category={post.category} />
              <StatusBadge status={post.status} />
              {post.isPublished ? (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                  Published
                </span>
              ) : (
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                  Unpublished
                </span>
              )}
            </div>
            <div className="mt-2 text-sm text-neutral-500">
              {post.author
                ? `By ${post.author.name}`
                : `Anonymous${post.contactEmail ? ` (${post.contactEmail})` : ""}`}
              {" "}&middot; {timeAgo(post.createdAt)}
              {" "}&middot; {post.voteCount} votes
            </div>
            <div className="mt-4 whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
              {post.description}
            </div>

            {post.mergedInto && (
              <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm dark:border-yellow-900 dark:bg-yellow-950">
                Merged into:{" "}
                <Link
                  href={`/admin/feedback/${post.mergedInto.id}`}
                  className="font-medium underline"
                >
                  {post.mergedInto.title}
                </Link>
              </div>
            )}

            {post.mergedPosts.length > 0 && (
              <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-900 dark:bg-blue-950">
                <p className="font-medium">Merged posts:</p>
                <ul className="mt-1 list-disc pl-5">
                  {post.mergedPosts.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/admin/feedback/${p.id}`}
                        className="underline"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
            <h2 className="font-semibold">Comments ({post.comments.length})</h2>
            <div className="mt-4">
              <CommentForm postId={post.id} />
            </div>
            {post.comments.length > 0 && (
              <div className="mt-4 space-y-3">
                {post.comments.map((c) => (
                  <div
                    key={c.id}
                    className={`rounded-lg border p-3 text-sm ${
                      c.isStaffReply
                        ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
                        : "border-neutral-100 dark:border-neutral-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {c.author.image && (
                        <img src={c.author.image} alt="" className="h-5 w-5 rounded-full" />
                      )}
                      <span className="font-medium">{c.author.name}</span>
                      {c.isStaffReply && (
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          Staff
                        </span>
                      )}
                      <span className="text-neutral-500">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap">{c.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar controls */}
        <div className="space-y-4">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
            <h3 className="text-sm font-semibold mb-3">Actions</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-neutral-500">Status</label>
                <AdminStatusSelect postId={post.id} currentStatus={post.status} />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500">Assignee</label>
                <AdminAssigneeSelect
                  postId={post.id}
                  currentAssigneeId={post.assigneeId}
                  staff={staff}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500">Visibility</label>
                <AdminPublishToggle postId={post.id} isPublished={post.isPublished} />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500">Tags</label>
                <AdminTagInput
                  postId={post.id}
                  currentTags={post.tags.map((t) => t.name)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500">Merge</label>
                <AdminMergeDialog postId={post.id} postTitle={post.title} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
