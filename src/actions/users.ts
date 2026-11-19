"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireManageUsers, requireSession } from "@/lib/auth-guards";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function listUsers(): Promise<
  ActionResult<
    Array<{
      id: string;
      name: string;
      email: string;
      role: Role;
      active: boolean;
      createdAt: string;
    }>
  >
> {
  try {
    await requireManageUsers();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    return {
      ok: true,
      data: users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
    };
  } catch {
    return { ok: false, error: "Hauna ruhusa ya kuona users." };
  }
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
}): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireManageUsers();

    if (!input.name.trim() || !input.email.trim() || input.password.length < 6) {
      return { ok: false, error: "Jaza name, email, na password (min 6)." };
    }

    if (input.role === "SUPER_ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return { ok: false, error: "Owner hawezi kuunda Super Admin." };
    }

    if (session.user.role === "OWNER" && input.role === "OWNER") {
      return { ok: false, error: "Owner hawezi kuunda Owner mwingine." };
    }

    const email = input.email.toLowerCase().trim();
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return { ok: false, error: "Email tayari ipo." };
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
      data: {
        name: input.name.trim(),
        email,
        passwordHash,
        role: input.role,
      },
    });

    revalidatePath("/admin/users");
    return { ok: true, data: { id: user.id } };
  } catch {
    return { ok: false, error: "Imeshindikana kuunda user." };
  }
}

export async function updateUserRole(
  id: string,
  role: Role
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireManageUsers();

    if (role === "SUPER_ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return { ok: false, error: "Owner hawezi kutoa Super Admin." };
    }

    if (id === session.user.id) {
      return { ok: false, error: "Huwezi kubadilisha role yako mwenyewe." };
    }

    await prisma.user.update({ where: { id }, data: { role } });
    revalidatePath("/admin/users");
    return { ok: true, data: { id } };
  } catch {
    return { ok: false, error: "Imeshindikana kubadilisha role." };
  }
}

export async function resetUserPassword(
  id: string,
  newPassword: string
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireManageUsers();
    if (newPassword.length < 6) {
      return { ok: false, error: "Password mpya iwe angalau herufi 6." };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id }, data: { passwordHash } });
    revalidatePath("/admin/users");
    return { ok: true, data: { id } };
  } catch {
    return { ok: false, error: "Imeshindikana ku-reset password." };
  }
}

export async function toggleUserActive(
  id: string
): Promise<ActionResult<{ id: string; active: boolean }>> {
  try {
    const session = await requireManageUsers();
    if (id === session.user.id) {
      return { ok: false, error: "Huwezi kujizima akaunti yako." };
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return { ok: false, error: "User hajapatikana." };

    if (user.role === "SUPER_ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return { ok: false, error: "Huwezi kubadilisha Super Admin." };
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { active: !user.active },
    });

    revalidatePath("/admin/users");
    return { ok: true, data: { id: updated.id, active: updated.active } };
  } catch {
    return { ok: false, error: "Imeshindikana kubadilisha status ya user." };
  }
}

export async function getCurrentAdmin() {
  try {
    const session = await requireSession();
    return { ok: true as const, data: session.user };
  } catch {
    return { ok: false as const, error: "Unauthorized" };
  }
}
