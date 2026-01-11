import Link from "next/link";
import { UserPlus, Calendar, CreditCard } from "lucide-react";

export function QuickLinksSection() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* S'inscrire en L1 */}
          <Link
            href="/universite"
            className="group flex items-center gap-6 p-8 bg-[#1b4332] text-white rounded-2xl shadow-lg hover:bg-green-900 transition-all"
          >
            <UserPlus className="w-10 h-10 text-[#d4af37]" />
            <div>
              <h3 className="text-xl font-bold">S'inscrire en L1</h3>
              <p className="text-white/70 text-sm">Procédures et dossiers d'admission</p>
            </div>
          </Link>

          {/* Calendrier Académique */}
          <Link
            href="/documents"
            className="group flex items-center gap-6 p-8 bg-white dark:bg-[#101622] border-2 border-[#1b4332]/10 dark:border-gray-700 rounded-2xl shadow-sm hover:border-[#d4af37] transition-all"
          >
            <Calendar className="w-10 h-10 text-[#1b4332] dark:text-[#d4af37]" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Calendrier Académique</h3>
              <p className="text-gray-500 text-sm">Dates clés de l'année 2024-2025</p>
            </div>
          </Link>

          {/* Droits & Frais */}
          <Link
            href="/documents"
            className="group flex items-center gap-6 p-8 bg-[#d4af37] text-[#1b4332] rounded-2xl shadow-lg hover:bg-yellow-600 transition-all"
          >
            <CreditCard className="w-10 h-10" />
            <div>
              <h3 className="text-xl font-bold">Droits & Frais</h3>
              <p className="text-[#1b4332]/80 text-sm">Tarifs et modalités de paiement</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
