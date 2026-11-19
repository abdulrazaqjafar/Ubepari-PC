import { auth } from "@/auth";
import type { Role } from "@prisma/client";
import {
  canCreateLaptops,
  canDeleteLaptops,
  canManageUsers,
  canUpdateStock,
} from "@/lib/rbac";

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireRole(allowed: Role[]) {
  const session = await requireSession();
  if (!allowed.includes(session.user.role)) {
    throw new Error("Forbidden");
  }
  return session;
}

export async function requireManageUsers() {
  const session = await requireSession();
  if (!canManageUsers(session.user.role)) {
    throw new Error("Forbidden");
  }
  return session;
}

export async function requireDeleteLaptops() {
  const session = await requireSession();
  if (!canDeleteLaptops(session.user.role)) {
    throw new Error("Forbidden");
  }
  return session;
}

export async function requireCreateLaptops() {
  const session = await requireSession();
  if (!canCreateLaptops(session.user.role)) {
    throw new Error("Forbidden");
  }
  return session;
}

export async function requireUpdateStock() {
  const session = await requireSession();
  if (!canUpdateStock(session.user.role)) {
    throw new Error("Forbidden");
  }
  return session;
}
