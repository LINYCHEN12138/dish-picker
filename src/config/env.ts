const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

export const publicEnv = {
  supabaseUrl,
  supabaseAnonKey,
  supabaseEnabled: Boolean(supabaseUrl && supabaseAnonKey),
};
