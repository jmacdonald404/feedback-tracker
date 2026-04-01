"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";
import { useCallback } from "react";

export function AdminFeedbackFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "ALL") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`/admin/feedback?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={searchParams.get("status") ?? "ALL"}
        onChange={(e) => updateParam("status", e.target.value)}
        className="w-auto"
      >
        <option value="ALL">All Statuses</option>
        <option value="NEW">New</option>
        <option value="UNDER_REVIEW">Under Review</option>
        <option value="PLANNED">Planned</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
        <option value="DECLINED">Declined</option>
      </Select>

      <Select
        value={searchParams.get("category") ?? "ALL"}
        onChange={(e) => updateParam("category", e.target.value)}
        className="w-auto"
      >
        <option value="ALL">All Categories</option>
        <option value="BUG">Bugs</option>
        <option value="FEATURE">Features</option>
        <option value="IMPROVEMENT">Improvements</option>
      </Select>

      <Select
        value={searchParams.get("published") ?? "ALL"}
        onChange={(e) => updateParam("published", e.target.value)}
        className="w-auto"
      >
        <option value="ALL">All</option>
        <option value="true">Published</option>
        <option value="false">Unpublished</option>
      </Select>
    </div>
  );
}
