export const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL!;

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
