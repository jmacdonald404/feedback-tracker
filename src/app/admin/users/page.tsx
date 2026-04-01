import { getAdminUsers } from "@/lib/actions/admin";
import { RoleToggle } from "@/components/admin/role-toggle";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {users.length} registered user{users.length !== 1 ? "s" : ""}
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left dark:border-neutral-800">
              <th className="pb-2 pr-4 font-medium">User</th>
              <th className="pb-2 pr-4 font-medium">Role</th>
              <th className="pb-2 pr-4 font-medium">Posts</th>
              <th className="pb-2 pr-4 font-medium">Comments</th>
              <th className="pb-2 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-neutral-100 dark:border-neutral-900"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    {user.image && (
                      <img
                        src={user.image}
                        alt=""
                        className="h-6 w-6 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium">{user.name ?? "—"}</p>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <RoleToggle userId={user.id} currentRole={user.role} />
                </td>
                <td className="py-3 pr-4">{user._count.posts}</td>
                <td className="py-3 pr-4">{user._count.comments}</td>
                <td className="py-3 text-neutral-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
