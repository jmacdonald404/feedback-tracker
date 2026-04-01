"use client";

import { useOptimistic, useTransition } from "react";
import { useSession } from "next-auth/react";
import { toggleVote } from "@/lib/actions/votes";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  postId: string;
  initialVoteCount: number;
  initialVoted: boolean;
  size?: "sm" | "lg";
}

export function VoteButton({
  postId,
  initialVoteCount,
  initialVoted,
  size = "sm",
}: VoteButtonProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const [optimistic, setOptimistic] = useOptimistic(
    { voted: initialVoted, count: initialVoteCount },
    (state, _action: "toggle") => ({
      voted: !state.voted,
      count: state.voted ? state.count - 1 : state.count + 1,
    })
  );

  function handleClick() {
    if (!session) {
      // Could show a sign-in prompt; for now rely on the signIn redirect
      window.location.href = "/api/auth/signin";
      return;
    }

    startTransition(async () => {
      setOptimistic("toggle");
      await toggleVote(postId);
    });
  }

  const isLarge = size === "lg";

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "flex flex-col items-center gap-1 rounded-lg border transition-colors",
        optimistic.voted
          ? "border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
          : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700",
        isLarge ? "px-4 py-3" : "px-2 py-1.5",
        isPending && "opacity-70"
      )}
      aria-label={optimistic.voted ? "Remove vote" : "Upvote"}
    >
      <ThumbsUp
        className={cn(
          isLarge ? "h-5 w-5" : "h-4 w-4",
          optimistic.voted && "fill-current"
        )}
      />
      <span className={cn("font-semibold", isLarge ? "text-lg" : "text-sm")}>
        {optimistic.count}
      </span>
      {isLarge && <span className="text-xs">votes</span>}
    </button>
  );
}
