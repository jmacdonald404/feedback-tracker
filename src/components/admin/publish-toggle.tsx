"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { togglePublish } from "@/lib/actions/admin";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  postId: string;
  isPublished: boolean;
}

export function AdminPublishToggle({ postId, isPublished }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant={isPublished ? "outline" : "default"}
      size="sm"
      className="w-full"
      disabled={isPending}
      onClick={() => startTransition(() => togglePublish(postId))}
    >
      {isPublished ? (
        <>
          <EyeOff className="h-4 w-4" />
          Unpublish
        </>
      ) : (
        <>
          <Eye className="h-4 w-4" />
          Publish
        </>
      )}
    </Button>
  );
}
