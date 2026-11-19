"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";

interface LogoutButtonProps {
  className?: string;
  showIcon?: boolean;
  label?: string;
}

export default function LogoutButton({
  className = "",
  showIcon = false,
  label = "Sign out",
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const onLogout = () => {
    startTransition(async () => {
      try {
        await logoutAction();
      } catch {
        // still leave the session UI even if server action throws
      } finally {
        // replace() drops admin pages from history so Back won't re-enter them
        window.location.replace("/admin/login?signedout=1");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={isPending}
      className={className}
    >
      {showIcon && <LogOut className="h-4 w-4" />}
      {isPending ? "Signing out…" : label}
    </button>
  );
}
