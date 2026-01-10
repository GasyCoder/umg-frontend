import Container from "@/components/Container";
import { publicGet, PUBLIC_API } from "@/lib/public-api";

type Doc = { id: number; title: string; slug: string; content_html?: string | null; };

import { notFound } from "next/navigation";

export default async function DocumentShow({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let d: Doc;

  try {
    const res = await publicGet<{ data: Doc }>(`/documents/${slug}`, 60);
    d = res.data;
  } catch (e) {
    notFound();
  }

  return (
    <main className="py-10">
      <Container>
        <h1 className="text-2xl font-semibold">{d.title}</h1>

        <div className="mt-4">
          <a
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
            href={`${PUBLIC_API}/documents/${d.id}/download`}
          >
            Télécharger
          </a>
        </div>

        <article className="prose prose-slate mt-8 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: d.content_html ?? "" }} />
        </article>
      </Container>
    </main>
  );
}