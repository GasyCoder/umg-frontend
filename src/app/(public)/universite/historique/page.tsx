import Container from "@/components/Container";
import { publicGet } from "@/lib/public-api";

export const metadata = {
  title: "Historique - Université de Mahajanga",
  description: "L'histoire de l'Université de Mahajanga depuis sa création",
};

type Page = {
  id: number;
  title: string;
  content: string | null;
  slug: string;
};

export default async function HistoriquePage() {
  let pages: Page[] = [];
  try {
    const res = await publicGet<{ data: Page[] }>("/organization-pages/type/historique", 60);
    pages = res.data || [];
  } catch {
    // No pages yet
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <Container>
          <div className="py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold">Historique</h1>
            <p className="mt-2 text-blue-100">L'histoire de l'Université de Mahajanga</p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12">
        <Container>
          {pages.length > 0 ? (
            <div className="max-w-3xl mx-auto space-y-8">
              {pages.map((page) => (
                <article key={page.id} className="prose prose-slate max-w-none">
                  <h2>{page.title}</h2>
                  {page.content && (
                    <div dangerouslySetInnerHTML={{ __html: page.content }} />
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">Contenu en cours de rédaction...</p>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
