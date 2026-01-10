import Container from "@/components/Container";
import { Card } from "@/components/Card";
import Link from "next/link";
import { publicGet } from "@/lib/public-api";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  published_at?: string | null;
  cover_image?: { url: string } | null;
};

export default async function HomePage() {
  const posts = await publicGet<{ data: Post[] }>("/posts?per_page=4", 30);

  return (
    <main>
      <section className="bg-white">
        <Container>
          <div className="py-14">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight">
                Université de Mahajanga
              </h1>
              <p className="mt-3 text-slate-600">
                Actualités, documents publics, partenariats et contact institutionnel.
              </p>

              <div className="mt-6 flex gap-3">
                <Link className="rounded-xl bg-slate-900 px-4 py-2 text-white" href="/actualites">
                  Voir les actualités
                </Link>
                <Link className="rounded-xl border px-4 py-2" href="/documents">
                  Documents
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="mt-10">
        <Container>
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-semibold">Actualités récentes</h2>
            <Link href="/actualites" className="text-sm text-slate-700 hover:text-slate-950">
              Tout voir
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {posts.data.map((p) => (
              <Card key={p.id}>
                <div className="flex gap-4">
                  {p.cover_image?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.cover_image.url}
                      alt={p.title}
                      className="h-20 w-28 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-20 w-28 rounded-xl bg-slate-100" />
                  )}
                  <div className="min-w-0">
                    <Link href={`/actualites/${p.slug}`} className="font-semibold hover:underline">
                      {p.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                      {p.excerpt ?? ""}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}