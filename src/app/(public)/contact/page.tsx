import Container from "@/components/Container";
import { Card } from "@/components/Card";

export default function ContactPage() {
  return (
    <main className="py-10">
      <Container>
        <h1 className="text-2xl font-semibold">Contact</h1>

        <div className="mt-6 max-w-xl">
          <Card>
            <p className="text-sm text-slate-600">
              Contact institutionnel (Service TIC). Formulaire dynamique à brancher à l’API ensuite.
            </p>

            <form className="mt-6 grid gap-3">
              <input className="rounded-xl border px-3 py-2" placeholder="Nom" />
              <input className="rounded-xl border px-3 py-2" placeholder="Email" />
              <textarea className="min-h-32 rounded-xl border px-3 py-2" placeholder="Message" />
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-white">
                Envoyer
              </button>
            </form>
          </Card>
        </div>
      </Container>
    </main>
  );
}