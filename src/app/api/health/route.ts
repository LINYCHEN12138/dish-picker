import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Check = {
  configured: boolean;
  status: "ok" | "not_configured" | "request_failed" | `http_${number}`;
};

async function checkSupabase(): Promise<Check> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return { configured: false, status: "not_configured" };

  try {
    const response = await fetch(`${url}/rest/v1/dishes?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    return {
      configured: true,
      status: response.ok ? "ok" : `http_${response.status}`,
    };
  } catch {
    return { configured: true, status: "request_failed" };
  }
}

export async function GET() {
  const provider = process.env.AI_PROVIDER?.trim().toLowerCase() || "deepseek";
  const aiKey = process.env.DEEPSEEK_API_KEY?.trim();
  const aiConfigured = provider === "deepseek" && Boolean(aiKey && aiKey !== "your_api_key_here");

  return NextResponse.json(
    {
      deployment: "v3-diagnostics-1",
      ai: {
        configured: aiConfigured,
        status: aiConfigured ? "configured" : provider === "deepseek" ? "not_configured" : "unsupported_provider",
      },
      supabase: await checkSupabase(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
