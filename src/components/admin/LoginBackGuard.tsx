"use client";

import { useEffect } from "react";

/**
 * Ensures browser Back from the login page returns to the public homepage,
 * instead of re-entering a previously authenticated admin route.
 */
export default function LoginBackGuard() {
  useEffect(() => {
    const loginUrl = `${window.location.pathname}${window.location.search}`;

    // Drop any prior admin entry when arriving via logout/replace flows.
    window.history.replaceState({ ubepariLogin: true }, "", loginUrl);
    window.history.pushState({ ubepariLogin: true }, "", loginUrl);

    const onPopState = () => {
      window.location.replace("/");
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return null;
}
