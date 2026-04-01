"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuery = searchParams.get("q") ?? "";

  useEffect(() => {
    // Sync input with URL on back/forward navigation
    if (inputRef.current) {
      inputRef.current.value = currentQuery;
    }
  }, [currentQuery]);

  function handleChange(value: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      router.push(`/feedback?${params.toString()}`);
    }, 300);
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <Input
        ref={inputRef}
        defaultValue={currentQuery}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search feedback..."
        className="pl-9"
      />
    </div>
  );
}
