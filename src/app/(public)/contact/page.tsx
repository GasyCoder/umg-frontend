import Container from "@/components/Container";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="bg-slate-50/70 dark:bg-slate-950">
      <section className="bg-gradient-to-br from-indigo-700 via-blue-700 to-slate-900 text-white">
        <Container>
          <div className="py-16 md:py-20">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-100">Contact</p>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">Restons en contact</h1>
            <p className="mt-4 max-w-2xl text-lg text-indigo-100">
              Notre équipe est à votre écoute pour toute information institutionnelle, académique ou
              administrative.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200/70 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Envoyer un message
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Remplissez le formulaire pour contacter la direction ou le service TIC.
              </p>
              <form className="mt-6 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Nom complet
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Votre nom"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Email institutionnel
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="nom@umg.mg"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Sujet
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Objet de votre message"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Votre message..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-2xl bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:bg-amber-300"
                >
                  Envoyer le message
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Coordonnées</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-indigo-500" />
                    Campus Universitaire, Mahajanga 401, Madagascar
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-indigo-500" />
                    <a href="tel:+261320000000" className="hover:text-indigo-600">
                      +261 32 00 000 00
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-indigo-500" />
                    <a href="mailto:contact@umg.mg" className="hover:text-indigo-600">
                      contact@umg.mg
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    Lun - Ven : 08:00 - 17:00
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/70 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <iframe
                  title="Carte Université de Mahajanga"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=46.30%2C-15.76%2C46.40%2C-15.70&layer=mapnik&marker=-15.74%2C46.33"
                  className="h-64 w-full rounded-2xl"
                />
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 p-6 text-white shadow-lg">
                <h3 className="text-lg font-semibold">Informations rapides</h3>
                <p className="mt-2 text-sm text-indigo-100">
                  Service TIC · Accueil institutionnel · Relations internationales
                </p>
                <button
                  type="button"
                  className="mt-4 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/20"
                >
                  Télécharger notre brochure
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
