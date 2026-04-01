import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { CategoryBadge } from "@/components/category-badge";
import { VoteButton } from "@/components/vote-button";
import type { FeedbackListItem } from "@/lib/actions/queries";

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

interface FeedbackCardProps {
  post: FeedbackListItem;
  voted: boolean;
}

export function FeedbackCard({ post, voted }: FeedbackCardProps) {
  return (
    <div className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
      {/* Vote button (stops propagation so it doesn't navigate) */}
      <div className="flex-shrink-0">
        <VoteButton
          postId={post.id}
          initialVoteCount={post.voteCount}
          initialVoted={voted}
        />
      </div>

      {/* Content — clickable link */}
      <Link
        href={`/feedback/${post.id}`}
        className="flex-1 min-w-0 transition-colors hover:opacity-80"
      >
        <h3 className="font-medium truncate">{post.title}</h3>
        <p className="mt-1 text-sm text-neutral-600 line-clamp-2 dark:text-neutral-400">
          {post.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <CategoryBadge category={post.category} />
          <StatusBadge status={post.status} />
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {post._count.comments}
          </span>
          <span>&middot;</span>
          {post.author?.name && <span>{post.author.name}</span>}
          <span>{timeAgo(post.createdAt)}</span>
        </div>
      </Link>
    </div>
  );
}
