import Container from "@/components/Container";
import { Card } from "@/components/Card";
import Link from "next/link";
import { publicGet, PUBLIC_API } from "@/lib/public-api";

type Doc = { id: number; title: string; slug: string; excerpt?: string | null; };

export default async function DocumentsPage() {
  const res = await publicGet<{ data: Doc[] }>("/documents?per_page=20", 60);

  return (
    <main className="py-10">
      <Container>
        <h1 className="text-2xl font-semibold">Documents</h1>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {res.data.map((d) => (
            <Card key={d.id}>
              <Link href={`/documents/${d.slug}`} className="font-semibold hover:underline">
                {d.title}
              </Link>
              <p className="mt-2 text-sm text-slate-600 line-clamp-3">{d.excerpt ?? ""}</p>

              <div className="mt-4">
                <a
                  className="text-sm font-medium text-slate-900 hover:underline"
                  href={`${PUBLIC_API}/documents/${d.id}/download`}
                >
                  Télécharger
                </a>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </main>
  );
}