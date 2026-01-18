"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowUpRight, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function NewsletterSection() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsletterEmail) {
      setNewsletterStatus("error");
      setNewsletterMessage("Merci de renseigner votre adresse e-mail.");
      return;
    }

    try {
      setNewsletterStatus("loading");
      setNewsletterMessage("");
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      }).then((r) => r.json());

      setNewsletterStatus("success");
      setNewsletterMessage(res?.message || "Merci ! Vérifiez votre boîte mail pour confirmer votre inscription.");
      setNewsletterEmail("");
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Impossible d'envoyer votre inscription. Réessayez dans un instant.";
      setNewsletterStatus("error");
      setNewsletterMessage(message);
    }
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-[#101622]">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Newsletter Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 rounded-2xl p-8 text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/20" />
              <div className="absolute -left-5 -bottom-5 w-32 h-32 rounded-full bg-white/20" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5 mb-4">
                <Mail className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Newsletter</span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-3">
                Recevez les infos essentielles de l'UMG
              </h3>
              <p className="text-blue-100 text-sm mb-6">
                Publications officielles, calendriers académiques et événements majeurs directement dans votre boîte mail.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(event) => setNewsletterEmail(event.target.value)}
                      placeholder="Votre adresse e-mail"
                      className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={newsletterStatus === "loading"}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 whitespace-nowrap shadow-lg"
                  >
                    {newsletterStatus === "loading" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Je m'abonne
                      </>
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                {newsletterMessage && (
                  <div className={`flex items-start gap-2 p-3 rounded-lg ${
                    newsletterStatus === "success"
                      ? "bg-emerald-500/20 text-emerald-100"
                      : "bg-red-500/20 text-red-100"
                  }`}>
                    {newsletterStatus === "success" ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm">{newsletterMessage}</p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Candidature Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white" />
              <div className="absolute -left-5 -bottom-5 w-32 h-32 rounded-full bg-white" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 rounded-full px-3 py-1.5 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider">Candidature</span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-3">
                S'inscrire à l'Université
              </h3>
              <p className="text-slate-300 text-sm mb-6">
                Explorez nos filières, rencontrez nos équipes pédagogiques et choisissez l'établissement qui vous correspond.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/universite"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-3 text-sm font-bold transition-colors shadow-lg"
                >
                  S'inscrire maintenant
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/etablissements"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-600 hover:border-slate-500 text-white px-6 py-3 text-sm font-bold hover:bg-slate-700/50 transition-colors"
                >
                  Nos établissements
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
