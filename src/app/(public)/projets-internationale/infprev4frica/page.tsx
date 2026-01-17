import Container from "@/components/Container";

export default function ProjetInfPrev4fricaPage() {
  return (
    <main className="bg-slate-50/60 dark:bg-slate-950">
      <section className="bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white">
        <Container className="max-w-[1280px] px-5 md:px-10">
          <div className="py-6 md:py-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
              Projets Internationale
            </p>
            <h1 className="mt-3 text-xl md:text-3xl font-bold tracking-tight">
              Projet InfPrev4frica
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
              Présentation du projet InfPrev4frica (contenu à compléter).
            </p>
          </div>
        </Container>
      </section>

      <Container className="max-w-[1280px] px-5 md:px-10">
        <div className="py-10">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-700 dark:text-slate-300">
              Cette page sera mise à jour avec la description complète, les objectifs, les activités et les résultats du
              projet.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}

