"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { manageTags } from "@/lib/actions/admin";
import { X, Plus } from "lucide-react";

interface Props {
  postId: string;
  currentTags: string[];
}

export function AdminTagInput({ postId, currentTags }: Props) {
  const [tags, setTags] = useState(currentTags);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

  function addTag() {
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed];
      setTags(newTags);
      setInput("");
      startTransition(() => manageTags(postId, newTags));
    }
  }

  function removeTag(tag: string) {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    startTransition(() => manageTags(postId, newTags));
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-800"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Add tag..."
          className="h-8 text-xs"
          disabled={isPending}
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={addTag}
          disabled={isPending || !input.trim()}
          className="h-8 px-2"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
