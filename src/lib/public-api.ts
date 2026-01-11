export const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL!;
import type { SiteSettings } from "./types";

async function safeJson(res: Response) {
  const txt = await res.text();
  try {
    return JSON.parse(txt);
  } catch {
    return { message: txt };
  }
}

export async function publicGet<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${PUBLIC_API}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate },
  });

  if (!res.ok) {
    const body = await safeJson(res);
    throw new Error(body?.message || `API error ${res.status}`);
  }
  return res.json();
}

export async function getSiteSettings() {
  return publicGet<SiteSettings>("/settings");
}

export async function publicPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${PUBLIC_API}${path}`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Accept: "application/json" 
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const json = await safeJson(res);
    throw new Error(json?.message || `API error ${res.status}`);
  }
  return res.json();
}
