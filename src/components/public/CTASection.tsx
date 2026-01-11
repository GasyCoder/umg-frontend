"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Check, AlertCircle, Loader2 } from "lucide-react";

export function CTASection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("Inscription validée !");
        setEmail("");
      } else {
        setStatus("error");
        setMessage("Une erreur est survenue.");
      }
    } catch {
      setStatus("error");
      setMessage("Erreur de connexion.");
    }
  };

  return (
    <section className="py-16 bg-[#1b4332]">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Newsletter Side */}
          <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Newsletter Universitaire
            </h3>
            <p className="text-white/70 mb-8">
              Recevez hebdomadairement l'essentiel de la vie de notre campus directement dans votre boîte mail.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <div className="relative flex-grow">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-5 pl-12 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={`px-8 py-3 rounded-xl font-black uppercase tracking-tight transition-all whitespace-nowrap ${
                  status === "success"
                    ? "bg-emerald-500 text-white cursor-default"
                    : "bg-[#d4af37] text-[#1b4332] hover:bg-white"
                }`}
              >
                {status === "loading" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : status === "success" ? (
                  <Check className="w-5 h-5" />
                ) : (
                  "S'inscrire"
                )}
              </button>
            </form>
            
            {message && status === "error" && (
              <p className="mt-3 text-sm text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {message}
              </p>
            )}
          </div>

          {/* CTA Side */}
          <div className="text-center lg:text-right">
            <h3 className="text-3xl font-black text-white mb-6">
              Prêt à nous rejoindre ?
            </h3>
            <p className="text-white/80 text-lg mb-10 max-w-md lg:ml-auto">
              Prenez rendez-vous avec nos conseillers d'orientation ou contactez directement nos départements.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-end">
              <Link
                href="/contact"
                className="bg-white text-[#1b4332] px-10 py-4 rounded-xl font-bold hover:bg-[#d4af37] transition-colors"
              >
                Nous Contacter
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-[#1b4332] transition-colors"
              >
                Prendre RDV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
