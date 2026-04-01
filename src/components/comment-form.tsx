"use client";

import { useActionState } from "react";
import { useSession } from "next-auth/react";
import { createComment, type CommentResult } from "@/lib/actions/comments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";

interface CommentFormProps {
  postId: string;
}

export function CommentForm({ postId }: CommentFormProps) {
  const { data: session } = useSession();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (_prev: CommentResult | null, formData: FormData) => {
      const result = await createComment(postId, formData);
      if (result.success) {
        formRef.current?.reset();
      }
      return result;
    },
    null
  );

  if (!session) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-center text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        <a href="/api/auth/signin" className="font-medium underline">
          Sign in
        </a>{" "}
        to leave a comment.
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {state && !state.success && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {state.error}
        </div>
      )}
      <Textarea
        name="content"
        required
        minLength={1}
        maxLength={2000}
        rows={3}
        placeholder="Add a comment..."
      />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
}
