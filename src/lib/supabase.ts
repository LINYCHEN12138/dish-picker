import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { publicEnv } from "@/config/env";
import type { Database } from "@/types/database";

let client: SupabaseClient<Database> | null | undefined;

export function getSupabaseClient() {
  if (!publicEnv.supabaseEnabled) return null;
  if (client !== undefined) return client;
  client = createClient<Database>(publicEnv.supabaseUrl, publicEnv.supabasePublishableKey, {
    auth: { persistSession: typeof window !== "undefined", autoRefreshToken: typeof window !== "undefined" },
  });
  return client;
}
