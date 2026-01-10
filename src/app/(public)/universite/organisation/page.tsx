import Container from "@/components/Container";
import { publicGet } from "@/lib/public-api";

export const metadata = {
  title: "Organisation - Université de Mahajanga",
  description: "Organisation, présidence, directions et services de l'Université de Mahajanga",
};

type Page = {
  id: number;
  title: string;
  content: string | null;
  slug: string;
};

export default async function OrganisationPage() {
  let pages: Page[] = [];
  try {
    const res = await publicGet<{ data: Page[] }>("/organization-pages/type/organisation", 60);
    pages = res.data || [];
  } catch {
    // No pages yet
  }

  // Also try to get organigramme
  let organigramme: Page[] = [];
  try {
    const res = await publicGet<{ data: Page[] }>("/organization-pages/type/organigramme", 60);
    organigramme = res.data || [];
  } catch {}

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <Container>
          <div className="py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold">Organisation</h1>
            <p className="mt-2 text-indigo-100">Présidence, directions, services et organigramme</p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-12">
        <Container>
          {pages.length > 0 || organigramme.length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-12">
              {pages.map((page) => (
                <article key={page.id} className="prose prose-slate max-w-none">
                  <h2>{page.title}</h2>
                  {page.content && (
                    <div dangerouslySetInnerHTML={{ __html: page.content }} />
                  )}
                </article>
              ))}

              {organigramme.length > 0 && (
                <div className="border-t pt-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Organigramme</h2>
                  {organigramme.map((page) => (
                    <article key={page.id} className="prose prose-slate max-w-none">
                      {page.content && (
                        <div dangerouslySetInnerHTML={{ __html: page.content }} />
                      )}
                    </article>
                  ))}
                </div>
              )}
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
