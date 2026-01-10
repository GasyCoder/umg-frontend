import { NextResponse } from "next/server";
import { getAdminToken } from "@/lib/auth";

const API_URL = process.env.API_URL;

async function forward(req: Request, parts: string[]) {
  if (!API_URL) return NextResponse.json({ message: "API_URL missing" }, { status: 500 });

  const token = await getAdminToken();
  if (!token) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

  const url = new URL(req.url);
  const target = `${API_URL}/admin/${parts.join("/")}${url.search}`;

  const headers = new Headers(req.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");

  const method = req.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);

  const r = await fetch(target, {
    method,
    headers,
    body: hasBody ? req.body : undefined,
    // @ts-expect-error: Next.js RequestInit doesn't yet include duplex: 'half' in some versions
    duplex: "half",
    cache: "no-store",
  });

  const buffer = await r.arrayBuffer();
  const contentType = r.headers.get("content-type") || "application/json";

  return new NextResponse(buffer, { status: r.status, headers: { "content-type": contentType } });
}

export const GET = async (req: Request, ctx: { params: Promise<{ path: string[] }> }) => forward(req, (await ctx.params).path);
export const POST = async (req: Request, ctx: { params: Promise<{ path: string[] }> }) => forward(req, (await ctx.params).path);
export const PUT = async (req: Request, ctx: { params: Promise<{ path: string[] }> }) => forward(req, (await ctx.params).path);
export const PATCH = async (req: Request, ctx: { params: Promise<{ path: string[] }> }) => forward(req, (await ctx.params).path);
export const DELETE = async (req: Request, ctx: { params: Promise<{ path: string[] }> }) => forward(req, (await ctx.params).path);
