"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/select";
import { setUserRole } from "@/lib/actions/admin";

interface Props {
  userId: string;
  currentRole: string;
}

export function RoleToggle({ userId, currentRole }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={currentRole}
      disabled={isPending}
      onChange={(e) => {
        startTransition(() =>
          setUserRole(userId, e.target.value as "USER" | "ADMIN")
        );
      }}
      className={`w-24 ${isPending ? "opacity-50" : ""}`}
    >
      <option value="USER">User</option>
      <option value="ADMIN">Admin</option>
    </Select>
  );
}
