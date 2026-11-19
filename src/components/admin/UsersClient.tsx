"use client";

import { useState, useTransition } from "react";
import type { Role } from "@prisma/client";
import {
  createUser,
  resetUserPassword,
  toggleUserActive,
  updateUserRole,
} from "@/actions/users";
import { roleLabel } from "@/lib/rbac";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

interface UsersClientProps {
  initialUsers: AdminUser[];
  currentUserId: string;
  currentRole: Role;
}

const fieldClass =
  "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20";

export default function UsersClient({
  initialUsers,
  currentUserId,
  currentRole,
}: UsersClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "SALES_CLERK" as Role,
  });

  const assignableRoles: Role[] =
    currentRole === "SUPER_ADMIN"
      ? ["SALES_CLERK", "OWNER"]
      : ["SALES_CLERK"];

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    startTransition(async () => {
      const result = await createUser(form);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage("User ameundwa.");
      setForm({
        name: "",
        email: "",
        password: "",
        role: "SALES_CLERK",
      });
      window.location.reload();
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Assign roles and reset passwords (Owner / Super Admin only)
        </p>
      </div>

      <form
        onSubmit={onCreate}
        className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 sm:grid-cols-2 lg:grid-cols-5"
      >
        <input
          required
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Full name"
          className={fieldClass}
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          placeholder="Email"
          className={fieldClass}
        />
        <input
          required
          type="password"
          minLength={6}
          value={form.password}
          onChange={(e) =>
            setForm((p) => ({ ...p, password: e.target.value }))
          }
          placeholder="Temp password"
          className={fieldClass}
        />
        <select
          value={form.role}
          onChange={(e) =>
            setForm((p) => ({ ...p, role: e.target.value as Role }))
          }
          className={fieldClass}
        >
          {assignableRoles.map((role) => (
            <option key={role} value={role}>
              {roleLabel(role)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-600/20 disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Create User"}
        </button>
      </form>

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {message}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 text-slate-600">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    disabled={user.id === currentUserId}
                    onChange={(e) => {
                      const role = e.target.value as Role;
                      startTransition(async () => {
                        const result = await updateUserRole(user.id, role);
                        if (!result.ok) {
                          setError(result.error);
                          return;
                        }
                        setUsers((prev) =>
                          prev.map((u) =>
                            u.id === user.id ? { ...u, role } : u
                          )
                        );
                      });
                    }}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-800 disabled:opacity-50"
                  >
                    {(["SALES_CLERK", "OWNER", "SUPER_ADMIN"] as Role[])
                      .filter(
                        (role) =>
                          currentRole === "SUPER_ADMIN" ||
                          role === "SALES_CLERK" ||
                          role === user.role
                      )
                      .map((role) => (
                        <option key={role} value={role}>
                          {roleLabel(role)}
                        </option>
                      ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-md border px-2 py-1 text-xs font-medium ${
                      user.active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-500"
                    }`}
                  >
                    {user.active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={user.id === currentUserId}
                      onClick={() => {
                        const password = window.prompt(
                          "Enter new password (min 6 chars)"
                        );
                        if (!password) return;
                        startTransition(async () => {
                          const result = await resetUserPassword(
                            user.id,
                            password
                          );
                          if (!result.ok) {
                            setError(result.error);
                            return;
                          }
                          setMessage(
                            `Password ya ${user.email} imebadilishwa.`
                          );
                        });
                      }}
                      className="rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1.5 text-xs font-medium text-cyan-800 hover:bg-cyan-100 disabled:opacity-40"
                    >
                      Reset Password
                    </button>
                    <button
                      type="button"
                      disabled={user.id === currentUserId}
                      onClick={() => {
                        startTransition(async () => {
                          const result = await toggleUserActive(user.id);
                          if (!result.ok) {
                            setError(result.error);
                            return;
                          }
                          setUsers((prev) =>
                            prev.map((u) =>
                              u.id === user.id
                                ? { ...u, active: result.data.active }
                                : u
                            )
                          );
                        });
                      }}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                    >
                      {user.active ? "Disable" : "Enable"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
