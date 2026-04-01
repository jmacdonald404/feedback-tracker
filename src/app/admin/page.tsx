import { getAdminStats } from "@/lib/actions/admin";
import Link from "next/link";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const statusMap: Record<string, string> = {
    NEW: "New",
    UNDER_REVIEW: "Under Review",
    PLANNED: "Planned",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    DECLINED: "Declined",
  };

  const categoryMap: Record<string, string> = {
    BUG: "Bugs",
    FEATURE: "Features",
    IMPROVEMENT: "Improvements",
  };

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Top-level stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Submissions" value={stats.total} />
        <StatCard label="Unreviewed" value={stats.unreviewed} highlight />
        <StatCard label="This Week" value={stats.thisWeek} />
        <StatCard
          label="Published"
          value={
            stats.total -
            stats.byStatus.reduce(
              (acc, s) => (s.status === "NEW" ? acc + s._count : acc),
              0
            )
          }
        />
      </div>

      {/* Breakdown */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <h3 className="font-semibold">By Status</h3>
          <div className="mt-3 space-y-2">
            {stats.byStatus.map((s) => (
              <div key={s.status} className="flex justify-between text-sm">
                <span>{statusMap[s.status] ?? s.status}</span>
                <span className="font-medium">{s._count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <h3 className="font-semibold">By Category</h3>
          <div className="mt-3 space-y-2">
            {stats.byCategory.map((c) => (
              <div key={c.category} className="flex justify-between text-sm">
                <span>{categoryMap[c.category] ?? c.category}</span>
                <span className="font-medium">{c._count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      {stats.unreviewed > 0 && (
        <div className="mt-6">
          <Link
            href="/admin/feedback?status=NEW"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Review {stats.unreviewed} unreviewed submission{stats.unreviewed !== 1 ? "s" : ""} &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-4 ${
      highlight
        ? "border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
        : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
    }`}>
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}
