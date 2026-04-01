"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";
import { useCallback } from "react";

export function FeedbackFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "newest";
  const currentCategory = searchParams.get("category") ?? "ALL";
  const currentStatus = searchParams.get("status") ?? "ALL";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "ALL" || value === "newest") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page"); // Reset to page 1
      router.push(`/feedback?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={currentCategory}
        onChange={(e) => updateParam("category", e.target.value)}
        className="w-auto"
      >
        <option value="ALL">All Categories</option>
        <option value="BUG">Bug Reports</option>
        <option value="FEATURE">Feature Requests</option>
        <option value="IMPROVEMENT">Improvements</option>
      </Select>

      <Select
        value={currentStatus}
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
        value={currentSort}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="w-auto"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="votes">Most Votes</option>
        <option value="updated">Recently Updated</option>
      </Select>
    </div>
  );
}
