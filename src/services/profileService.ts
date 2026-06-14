import { getSupabaseClient } from "@/lib/supabase";

export async function ensureSession() {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  if (data.session?.user) return data.session.user;
  const { data: signedIn, error } = await client.auth.signInAnonymously();
  if (error) {
    console.warn("[profileService] Anonymous sign-in failed; personal data stays local", error);
    return null;
  }
  return signedIn.user;
}
