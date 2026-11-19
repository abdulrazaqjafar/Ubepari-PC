"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function loginAction(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    if (!result || result.error) {
      return { ok: false, error: "Email au password si sahihi. Jaribu tena." };
    }

    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Email au password si sahihi. Jaribu tena." };
    }
    console.error("loginAction failed:", error);
    return { ok: false, error: "Imeshindikana kuingia. Jaribu tena." };
  }
}

export async function logoutAction(): Promise<{ ok: true }> {
  await signOut({ redirect: false });
  return { ok: true };
}
