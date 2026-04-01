"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/select";
import { updateFeedbackStatus } from "@/lib/actions/admin";

interface Props {
  postId: string;
  currentStatus: string;
}

export function AdminStatusSelect({ postId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={currentStatus}
      disabled={isPending}
      onChange={(e) => {
        startTransition(() => updateFeedbackStatus(postId, e.target.value));
      }}
      className={isPending ? "opacity-50" : ""}
    >
      <option value="NEW">New</option>
      <option value="UNDER_REVIEW">Under Review</option>
      <option value="PLANNED">Planned</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="COMPLETED">Completed</option>
      <option value="DECLINED">Declined</option>
    </Select>
  );
}
