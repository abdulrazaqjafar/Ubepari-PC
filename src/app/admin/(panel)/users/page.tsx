import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listUsers } from "@/actions/users";
import { canManageUsers } from "@/lib/rbac";
import UsersClient from "@/components/admin/UsersClient";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!canManageUsers(session?.user?.role)) {
    redirect("/admin/dashboard");
  }

  const result = await listUsers();

  return (
    <UsersClient
      initialUsers={result.ok ? result.data : []}
      currentUserId={session!.user.id}
      currentRole={session!.user.role}
    />
  );
}
