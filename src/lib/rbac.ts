import type { Role } from "@prisma/client";

export type AppRole = Role;

export const MANAGEMENT_ROLES: AppRole[] = ["SUPER_ADMIN", "OWNER"];
export const ALL_ADMIN_ROLES: AppRole[] = [
  "SUPER_ADMIN",
  "OWNER",
  "SALES_CLERK",
];

export function canManageUsers(role?: AppRole | null): boolean {
  return !!role && MANAGEMENT_ROLES.includes(role);
}

export function canDeleteLaptops(role?: AppRole | null): boolean {
  return !!role && MANAGEMENT_ROLES.includes(role);
}

export function canCreateLaptops(role?: AppRole | null): boolean {
  return !!role && ALL_ADMIN_ROLES.includes(role);
}

export function canUpdateStock(role?: AppRole | null): boolean {
  return !!role && ALL_ADMIN_ROLES.includes(role);
}

export function canEditLaptops(role?: AppRole | null): boolean {
  return !!role && ALL_ADMIN_ROLES.includes(role);
}

export function canViewCompanyReports(role?: AppRole | null): boolean {
  return !!role && MANAGEMENT_ROLES.includes(role);
}

export function isCompanyOwner(role?: AppRole | null): boolean {
  return role === "OWNER" || role === "SUPER_ADMIN";
}

export function roleLabel(role: AppRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Admin";
    case "OWNER":
      return "Owner";
    case "SALES_CLERK":
      return "Sales Clerk";
    default:
      return role;
  }
}
