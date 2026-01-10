import Container from "@/components/Container";
import { publicGet } from "@/lib/public-api";

type Post = {
  title: string;
  slug: string;
  content_html?: string | null;
  published_at?: string | null;
};

export default async function NewsShow({ params }: { params: { slug: string } }) {
  const res = await publicGet<{ data: Post }>(`/posts/${params.slug}`, 30);
  const p = res.data;

  return (
    <main className="py-10">
      <Container>
        <h1 className="text-2xl font-semibold">{p.title}</h1>
        {p.published_at && (
          <p className="mt-2 text-sm text-slate-500">Publié : {new Date(p.published_at).toLocaleString()}</p>
        )}

        <article className="prose prose-slate mt-6 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: p.content_html ?? "" }} />
        </article>
      </Container>
    </main>
  );
}