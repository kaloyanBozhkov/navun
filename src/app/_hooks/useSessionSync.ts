"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/app/_stores/auth.store";

export function useSessionSync() {
  const { data: session, status } = useSession();
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: (session.user as { role?: string }).role ?? "USER",
      });
    } else if (status === "unauthenticated") {
      clearUser();
    }
  }, [session, status, setUser, clearUser]);
}
