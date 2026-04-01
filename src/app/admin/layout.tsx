import Link from "next/link";
import { LayoutDashboard, MessageSquare, Users } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden w-56 flex-shrink-0 border-r border-neutral-200 bg-neutral-50 p-4 md:block dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Admin
        </h2>
        <nav className="space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/feedback"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <MessageSquare className="h-4 w-4" />
            Feedback
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <Users className="h-4 w-4" />
            Users
          </Link>
        </nav>
      </aside>

      {/* Mobile nav */}
      <div className="border-b border-neutral-200 bg-neutral-50 p-2 md:hidden dark:border-neutral-800 dark:bg-neutral-900">
        <nav className="flex gap-2">
          <Link href="/admin" className="rounded-md px-3 py-1.5 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800">
            Dashboard
          </Link>
          <Link href="/admin/feedback" className="rounded-md px-3 py-1.5 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800">
            Feedback
          </Link>
          <Link href="/admin/users" className="rounded-md px-3 py-1.5 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800">
            Users
          </Link>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
