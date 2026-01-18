"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export function useProject(slug: string) {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${API_URL}/projects/${encodeURIComponent(slug)}`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = await res.json();
        const data = json?.data as Project | undefined;
        if (!data || cancelled) return;
        setProject(data);
      } catch {
        // Ignore
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return project;
}

