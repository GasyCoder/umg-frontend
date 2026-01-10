"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

type EtablissementTabsProps = {
  presentation?: string | null;
  formations?: string[];
  contacts: {
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
  };
};

const tabs = ["Présentation", "Formations", "Contacts"] as const;

export default function EtablissementTabs({ presentation, formations = [], contacts }: EtablissementTabsProps) {
  const [active, setActive] = useState<(typeof tabs)[number]>("Présentation");

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/60 p-6 shadow-lg">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === tab
                ? "bg-indigo-600 text-white shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
            aria-pressed={active === tab}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active === "Présentation" && (
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {presentation ? (
              <div dangerouslySetInnerHTML={{ __html: presentation }} />
            ) : (
              <p>Présentation en cours de rédaction.</p>
            )}
          </div>
        )}

        {active === "Formations" && (
          <div>
            {formations.length ? (
              <ul className="grid gap-3 md:grid-cols-2">
                {formations.map((formation) => (
                  <li
                    key={formation}
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/70 p-4 text-sm text-slate-600 dark:text-slate-300"
                  >
                    {formation}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">Liste des formations à venir.</p>
            )}
          </div>
        )}

        {active === "Contacts" && (
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {contacts.address && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                <span>{contacts.address}</span>
              </div>
            )}
            {contacts.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <a className="hover:text-indigo-600" href={`tel:${contacts.phone}`}>
                  {contacts.phone}
                </a>
              </div>
            )}
            {contacts.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <a className="hover:text-indigo-600" href={`mailto:${contacts.email}`}>
                  {contacts.email}
                </a>
              </div>
            )}
            {contacts.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-slate-400" />
                <a
                  className="text-indigo-600 hover:underline"
                  href={contacts.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Site web officiel
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
