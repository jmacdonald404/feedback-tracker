"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/select";
import { assignFeedback } from "@/lib/actions/admin";

interface Props {
  postId: string;
  currentAssigneeId: string | null;
  staff: { id: string; name: string | null; image: string | null }[];
}

export function AdminAssigneeSelect({ postId, currentAssigneeId, staff }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={currentAssigneeId ?? ""}
      disabled={isPending}
      onChange={(e) => {
        const value = e.target.value || null;
        startTransition(() => assignFeedback(postId, value));
      }}
      className={isPending ? "opacity-50" : ""}
    >
      <option value="">Unassigned</option>
      {staff.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name ?? "Unknown"}
        </option>
      ))}
    </Select>
  );
}
