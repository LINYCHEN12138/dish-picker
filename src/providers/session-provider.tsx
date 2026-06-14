"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { publicEnv } from "@/config/env";
import { ensureSession } from "@/services/profileService";

type SessionContextValue = { user: User | null; loading: boolean; enabled: boolean; error: string };
const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(publicEnv.supabaseEnabled);
  const [error, setError] = useState("");
  useEffect(() => {
    ensureSession().then(setUser).catch((reason) => {
      console.error("[SessionProvider] Session initialization failed", reason);
      setError("云端身份暂时不可用，个人数据将保存在本机。");
    }).finally(() => setLoading(false));
  }, []);
  const value = useMemo(() => ({ user, loading, enabled: publicEnv.supabaseEnabled, error }), [user, loading, error]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside SessionProvider");
  return context;
}
