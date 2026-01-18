import Container from "@/components/Container";
import PresidentMessage from "@/components/public/PresidentMessage";
import { publicGet } from "@/lib/public-api";
import type { PresidentMessage as PresidentMessageType } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mot du Président - Université de Mahajanga",
  description: "Découvrez le mot du Président de l'Université de Mahajanga.",
};

export default async function PresidentMessagePage() {
  const data = await publicGet<{ data: PresidentMessageType }>("/president-message", { cache: "no-store" }).catch(
    () => null
  );

  return (
    <main className="bg-white dark:bg-slate-950">
      <section className="bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white">
        <Container className="max-w-[1280px] px-5 md:px-10">
          <div className="py-6 md:py-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">Présidence</p>
            <h1 className="mt-3 text-xl md:text-3xl font-bold tracking-tight">Mot du Président</h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
              Message officiel de la présidence.
            </p>
          </div>
        </Container>
      </section>

      <PresidentMessage data={data?.data ?? null} />
    </main>
  );
}

