import Container from "@/components/Container";
import { Card } from "@/components/Card";
import Link from "next/link";
import { publicGet } from "@/lib/public-api";

type Post = { id: number; title: string; slug: string; excerpt?: string | null; };

export default async function NewsPage() {
  const res = await publicGet<{ data: Post[] }>("/posts?per_page=12", 30);

  return (
    <main className="py-10">
      <Container>
        <h1 className="text-2xl font-semibold">Actualités</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {res.data.map((p) => (
            <Card key={p.id}>
              <Link href={`/actualites/${p.slug}`} className="font-semibold hover:underline">
                {p.title}
              </Link>
              <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                {p.excerpt ?? ""}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </main>
  );
}