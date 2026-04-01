"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mergeFeedback } from "@/lib/actions/admin";
import { GitMerge } from "lucide-react";

interface Props {
  postId: string;
  postTitle: string;
}

export function AdminMergeDialog({ postId, postTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [targetId, setTargetId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleMerge() {
    if (!targetId.trim()) return;
    setError("");
    startTransition(async () => {
      try {
        await mergeFeedback(postId, targetId.trim());
        setOpen(false);
        setTargetId("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Merge failed");
      }
    });
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <GitMerge className="h-4 w-4" />
        Merge into...
      </Button>
    );
  }

  return (
    <div className="space-y-2 rounded-md border border-neutral-200 p-3 dark:border-neutral-800">
      <p className="text-xs text-neutral-500">
        Merge &ldquo;{postTitle}&rdquo; into another post. This will move all
        votes and comments to the target and unpublish this post.
      </p>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
      <Input
        value={targetId}
        onChange={(e) => setTargetId(e.target.value)}
        placeholder="Target post ID"
        className="h-8 text-xs"
        disabled={isPending}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="destructive"
          onClick={handleMerge}
          disabled={isPending || !targetId.trim()}
          className="flex-1"
        >
          {isPending ? "Merging..." : "Merge"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setOpen(false);
            setTargetId("");
            setError("");
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
