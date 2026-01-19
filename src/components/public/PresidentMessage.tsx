"use client";

import { useMemo, useState } from "react";
import type { PresidentMessage } from "@/lib/types";
import { useI18n } from "@/components/i18n/LanguageProvider";

interface PresidentMessageProps {
    data?: PresidentMessage | null;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export default function PresidentMessage({ data }: PresidentMessageProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const photoUrl =
    data?.photo?.url ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCJsTyyt3qhu-9IbTwrB9In9ZkJ7cyG_NpJuOLXUCuXwkgnHBKdrUdm5F2qmT-3CGXAAmL_ICYgygjj_-TPlDcZlPlgUYcPrmX0HnJl0TKMJJmodknVFAuu39kxmu7ZzWzWtEx7TOSUaNzCyKfjSP0dA7usQKNv86m2xU1vL_xTyTAGvjBxR_ts11Yny5tjnhnVb2in91zKIZxxNNT41Pd_Zv4fY_Mq8EHdc7e5-jIcP6q_SkR4_ROMwV86XA1gjfTyTRwbLQytYtc";

  const contentHtml = useMemo(() => {
    const content = (data?.content ?? "").trim();
    if (!content) return "";
    if (looksLikeHtml(content)) return content;
    return `<p>${escapeHtml(content).replaceAll("\n", "<br />")}</p>`;
  }, [data?.content]);

  const hasExpandableContent = Boolean(contentHtml);

  return (
    <section className="py-16 bg-slate-50 dark:bg-[#0B1120]/50 border-y border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          <div className="w-full md:w-1/3">
            <div className="relative">
              <div className="absolute top-4 left-4 w-full h-full border-2 border-primary dark:border-blue-500 rounded-2xl"></div>
              <div className="relative bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-xl">
                <div 
                  className="aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 bg-cover bg-center" 
                  style={{ backgroundImage: `url("${photoUrl}")` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-7/12">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-slate-300 dark:bg-slate-600"></span>
              <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-xs">{t("president.kicker")}</span>
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">{t("president.title")}</h2>
            
            <div className="relative pl-8 mb-8">
              <span className="absolute top-0 left-0 text-6xl text-primary/20 dark:text-white/10 font-serif font-black leading-none">“</span>
              <blockquote className="text-xl font-medium text-slate-700 dark:text-slate-300 italic leading-relaxed">
                {data?.intro || t("president.fallback.quote")}
              </blockquote>
            </div>
            
            <p
              className={`text-slate-500 dark:text-slate-400 leading-relaxed ${
                expanded ? "mb-6" : "mb-4 line-clamp-2"
              }`}
            >
               {data?.title ? data.title : t("president.fallback.lead")}
            </p>

            {expanded && hasExpandableContent ? (
              <article className="prose prose-slate dark:prose-invert max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
              </article>
            ) : null}

            {hasExpandableContent ? (
              <div className="mb-8">
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 transition-colors"
                >
                  {expanded ? t("president.less") : t("president.more")}
                </button>
              </div>
            ) : null}
            
            <div className="flex items-center border-t border-slate-200 dark:border-slate-700 pt-6">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">{data?.president_name || "Prof. Ravelomanana Jean"}</p>
                <p className="text-sm text-primary dark:text-blue-400 font-medium">{data?.president_title || t("president.fallback.title")}</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
