import Container from "@/components/Container";
import { Card } from "@/components/Card";
import { publicGet } from "@/lib/public-api";

type Partner = { id: number; name: string; type: "national" | "international"; website_url?: string | null; };

export default async function PartnershipsPage() {
  const res = await publicGet<{ data: Partner[] }>("/partners?per_page=100", 300);

  const national = res.data.filter(p => p.type === "national");
  const international = res.data.filter(p => p.type === "international");

  return (
    <main className="py-10">
      <Container>
        <h1 className="text-2xl font-semibold">Partenariats</h1>

        <h2 className="mt-8 text-lg font-semibold">Nationaux</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {national.map(p => (
            <Card key={p.id}>
              <div className="font-semibold">{p.name}</div>
              {p.website_url && (
                <a className="mt-2 block text-sm text-slate-700 hover:underline" href={p.website_url}>
                  {p.website_url}
                </a>
              )}
            </Card>
          ))}
        </div>

        <h2 className="mt-10 text-lg font-semibold">Internationaux</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {international.map(p => (
            <Card key={p.id}>
              <div className="font-semibold">{p.name}</div>
              {p.website_url && (
                <a className="mt-2 block text-sm text-slate-700 hover:underline" href={p.website_url}>
                  {p.website_url}
                </a>
              )}
            </Card>
          ))}
        </div>
      </Container>
    </main>
  );
}